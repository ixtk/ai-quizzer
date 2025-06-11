import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./models/User.js";
import { verifyAuth } from "./middleware/verifyAuth.js";

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
