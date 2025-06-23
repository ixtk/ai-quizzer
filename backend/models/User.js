import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true,
  },
});

export const User = mongoose.model("User", userSchema);

