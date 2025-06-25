import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { customAlphabet } from "nanoid";
import { createServer } from "http";
import { Server } from "socket.io";

import { verifyAuth } from "./middleware.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { User } from "./models/User.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const generateRoomCode = customAlphabet(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  6
);
const rooms = {};

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/quizzer", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.get("/hello-world", (req, res) => {
  res.json({ message: "Hello World" });
});

app.post("/users", verifyAuth, async (req, res) => {
  const firebaseId = req.user.uid;
  try {
    let user = await User.findOne({ firebaseId });
    if (!user) {
      user = await User.create({ firebaseId });
    }
    res.status(200).json({ message: "User verified or created", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/generate-quiz", async (req, res) => {
  const { topic, difficulty, numberOfQuestions } = req.body;

  const systemInstruction = `
    The quiz content must be family friendly.
    Output the questions in pure JSON format without any markdown (such as \`\`\` symbols).
    Format:
    [
      {
        "text": "Question text",
        "options": ["A", "B", "C", "D"],
        "correctAnswer": "B"
      }
    ]
  `;

  const userPrompt = `Generate ${
    numberOfQuestions || 5
  } quiz questions and correct answers about the topic: ${topic}. Difficulty must be ${difficulty}.`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      systemInstruction: {
        role: "system",
        parts: [{ text: systemInstruction }],
      },
    });

    const responseText = result.response.text();
    const quizData = JSON.parse(responseText);
    res.json(quizData);
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

app.post("/save-quiz", verifyAuth, async (req, res) => {
  const { title, questions } = req.body;
  const firebaseId = req.user.uid;

  if (!title || !Array.isArray(questions)) {
    return res.status(400).json({ error: "Missing title or questions" });
  }

  try {
    const user = await User.findOne({ firebaseId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const cleanedQuestions = questions.map(({ id, ...rest }) => rest);

    const newQuiz = {
      title,
      questions: cleanedQuestions,
      createdAt: new Date(),
    };

    user.quizzes.push(newQuiz);
    await user.save();

    res.status(200).json({ message: "Quiz saved successfully" });
  } catch (err) {
    console.error("Save Quiz Error:", err);
    res.status(500).json({ error: "Failed to save quiz" });
  }
});

app.get("/quizzes", verifyAuth, async (req, res) => {
  const firebaseId = req.user.uid;
  try {
    const user = await User.findOne({ firebaseId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user.quizzes || []);
  } catch (err) {
    console.error("Quiz fetch error:", err);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

app.post("/create-room", verifyAuth, async (req, res) => {
  const roomCode = generateRoomCode();

  rooms[roomCode] = {
    host: null,
    hostUsername: null,
    users: [],
    messages: [],
    status: "waiting",
  };

  res.status(201).json({ roomCode });
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) return next(new Error("Username required"));
  socket.username = username;
  next();
});

io.on("connection", (socket) => {
  console.log(`✅ [CONNECTED] ${socket.username} (${socket.id})`);

  socket.on("host-join-room", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const alreadyExists = room.users.some((u) => u.sId === socket.id);
    if (!alreadyExists) {
      room.users.push({
        sId: socket.id,
        username: socket.username,
        ready: false,
        answers: [],
      });
    }

    socket.join(roomCode);

    if (!room.hostUsername) {
      room.host = socket.id;
      room.hostUsername = socket.username;
      console.log(`👑 [HOST SET] ${socket.username} is host in ${roomCode}`);
    } else if (room.hostUsername === socket.username) {
      room.host = socket.id;
      console.log(
        `♻️ [HOST RESTORED] ${socket.username} rejoined as host in ${roomCode}`
      );
    } else {
      console.log(
        `🙅‍♂️ [NOT HOST] ${socket.username} joined, host is ${room.hostUsername}`
      );
    }

    io.to(roomCode).emit("user-joined", {
      users: room.users,
      hostId: room.host,
    });
  });

  socket.on("join-room", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const alreadyExists = room.users.some((u) => u.sId === socket.id);
    if (!alreadyExists) {
      room.users.push({
        sId: socket.id,
        username: socket.username,
        ready: false,
        answers: [],
      });
    }

    socket.join(roomCode);

    io.to(roomCode).emit("user-joined", {
      users: room.users,
      hostId: room.host,
    });
  });

  socket.on("toggle-ready", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const player = room.users.find((u) => u.sId === socket.id);
    if (player) {
      player.ready = !player.ready;
    }

    io.to(roomCode).emit("ready-updated", {
      users: room.users,
    });
  });

  socket.on("disconnect", () => {
    console.log(`⛔ [DISCONNECTED] ${socket.username} (${socket.id})`);

    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const idx = room.users.findIndex((u) => u.sId === socket.id);
      if (idx !== -1) {
        const username = room.users[idx].username;
        room.users.splice(idx, 1);

        const stillHere = room.users.find(
          (u) => u.username === room.hostUsername
        );
        if (room.host === socket.id && !stillHere) {
          console.log(
            `⏳ Waiting to see if host ${socket.username} reconnects...`
          );

          setTimeout(() => {
            const roomExists = rooms[roomCode];
            const hostStillMissing =
              roomExists &&
              !roomExists.users.find((u) => u.username === room.hostUsername);

            if (roomExists && hostStillMissing) {
              const newHost = roomExists.users[0];
              roomExists.host = newHost?.sId || null;
              roomExists.hostUsername = newHost?.username || null;
              console.log(
                `👑 [NEW HOST] ${
                  newHost?.username || "none"
                } promoted in ${roomCode}`
              );

              io.to(roomCode).emit("user-joined", {
                users: roomExists.users,
                hostId: roomExists.host,
              });
            } else {
              console.log(
                `✅ [HOST RETURNED] ${room.hostUsername} rejoined in time`
              );
            }
          }, 5000);
        }

        if (room.users.length === 0) {
          setTimeout(() => {
            if (rooms[roomCode] && rooms[roomCode].users.length === 0) {
              delete rooms[roomCode];
              console.log(`🗑️ [ROOM DELETED] ${roomCode}`);
            }
          }, 10000);
        }

        io.to(roomCode).emit("user-joined", {
          users: room.users,
          hostId: room.host,
        });
      }
    }
  });

  socket.on("game-started", async ({ roomCode, selectedQuizId }) => {
    const room = rooms[roomCode];
    if (!room) return;

    try {
      const user = await User.findOne({
        quizzes: { $elemMatch: { _id: selectedQuizId } },
      });
      if (!user) return;

      const quiz = user.quizzes.find(
        (q) => q._id.toString() === selectedQuizId
      );
      if (!quiz) return;

      room.status = "gameOngoing";
      room.selectedQuizId = selectedQuizId;
      room.quiz = quiz.questions;
      room.currentQuestionIndex = 0;

      io.to(roomCode).emit("phase-changed", {
        newPhase: "gameOngoing",
      });

      io.to(roomCode).emit("question", {
        index: 0,
        question: quiz.questions[0],
      });
    } catch (error) {
      console.error("❌ Failed to load quiz during game-started:", error);
    }
  });

  socket.on("select-answer", ({ selected }) => {
    const roomCode = socket.data.roomCode;
    const room = rooms[roomCode];
    const player = room.users.find((u) => u.sId === socket.id);

    if (!player.answers) {
      player.answers = {};
    }

    const index = player.currentIndex || 0;
    player.answers[index] = { answer: selected };

    socket.emit("answer-selected", {
      answers: player.answers,
    });

    // ინდივიდუალური ფაზის შეცვლა
    const playerFinished =
      Object.keys(player.answers).length === room.quiz.length;
    if (playerFinished) {
      socket.emit("phase-changed", {
        newPhase: "waitingForOthers",
      });
    }

    // ✅ ყველა დასრულების შემოწმება
    const allFinished = room.users.every(
      (u) => Object.keys(u.answers).length === room.quiz.length
    );

    if (allFinished) {
      io.to(roomCode).emit("phase-changed", {
        newPhase: "gameOver",
      });
    }
  });
  
});

httpServer.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
