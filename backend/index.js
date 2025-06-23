import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { customAlphabet } from "nanoid";
import { createServer } from "http";
import { Server } from "socket.io";

import { verifyAuth } from "./middleware.js";
import { User } from "./models/User.js";

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

app.post("/create-room", verifyAuth, async (req, res) => {
  const roomCode = generateRoomCode();

  rooms[roomCode] = {
    host: null,
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

    const hostPlayer = {
      sId: socket.id,
      username: socket.username,
      ready: false,
    };

    const alreadyExists = room.users.some((u) => u.sId === socket.id);
    if (!alreadyExists) {
      room.users.push(hostPlayer);
      console.log(`👑 [HOST JOINED] ${socket.username} in ${roomCode}`);
    }

    room.host = socket.id;
    socket.join(roomCode);

    io.to(roomCode).emit("user-joined", {
      users: room.users,
      hostId: room.host,
    });
  });

  socket.on("join-room", ({ roomCode }) => {
    const room = rooms[roomCode];
    if (!room) return;

    const newPlayer = {
      sId: socket.id,
      username: socket.username,
      ready: false,
    };

    const alreadyExists = room.users.some((u) => u.sId === socket.id);
    if (!alreadyExists) {
      room.users.push(newPlayer);
      console.log(`🙋 [PLAYER JOINED] ${socket.username} in ${roomCode}`);
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
      console.log(
        `🔄 [TOGGLE READY] ${player.username} is now ${
          player.ready ? "READY" : "NOT READY"
        } in ${roomCode}`
      );
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
        console.log(`📤 [REMOVED] ${username} left ${roomCode}`);

        if (room.host === socket.id) {
          room.host = room.users[0]?.sId || null;
          console.log(`👑 [HOST CHANGED] New host: ${room.host || "none"}`);
        }

        if (room.users.length === 0) {
          delete rooms[roomCode];
          console.log(`🗑️ [ROOM DELETED] ${roomCode}`);
        } else {
          io.to(roomCode).emit("user-disconnected", {
            users: room.users,
            hostId: room.host,
          });
        }
      }
    }
  });
});

httpServer.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
