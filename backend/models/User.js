import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
  },
  quizzes: [
    {
      text: String,
      options: [String],
      correctAnswer: String,
    },
  ],
});

export const User = mongoose.model("User", userSchema);

