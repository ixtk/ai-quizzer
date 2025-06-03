import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/hello-world", (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(3000, async () => {
  console.log("running on port 3000");
});
