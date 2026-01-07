import express from "express";
import cors from "cors";

const app = express();

let appState = {currentDate: "2025-01-01"}

let concepts = [
  {id: 1,
    concept: "Master Theorem",
    topic: "Computer Science",
    initialDate: "2025-09-04",
    lastReviewed: "2025-10-05",
    nextReviewDate: "2025-11-05",
    intervalDays: 30,
    repititionsLeft: 1
  }
]
let maxid = 1

app.use(cors());
app.use(express.json());

app.get("/check", (req, res) => {
  res.end("we good");
});

app.post("/concept/add", (req, res) => {
  const {concept, topic, initialDate} = req.body
  const id = maxid + 1
  maxid += 1
  const nextDate = initialDate || appState.currentDate
  const newConcept =
  {
    id,
    concept,
    topic,
    initialDate,
    lastReviewed: null,
    nextDate,
    intervalDays: 1,
    repititionsLeft: -1
  }

  concepts.unshift(newConcept)
  res.status(201)
  res.set("Content-Type", "application/json")
  console.log("Post worked")
  res.send(JSON.stringify(newConcept))
})



app.listen(3000, () => {
  console.log("API running on port 3000");
});
