import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/check", (req, res) => {
  res.end("we good");
});

app.listen(3000, () => {
  console.log("API running on port 3000");
});
