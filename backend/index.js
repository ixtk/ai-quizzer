import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./models/User.js";
import { verifyAuth } from "./middleware.js";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
