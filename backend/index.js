import express from "express";
import cors from "cors";

const app = express();

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function datePlusDays(days) {
  function addPadding(n) {
    return n < 10 ? "0" + n : String(n)
  }
  const d = new Date();
  d.setDate(d.getDate() + days);

  const yyyy = d.getFullYear();
  const mm = addPadding(d.getMonth() + 1)
  const dd = addPadding(d.getDate())

  return `${yyyy}-${mm}-${dd}`;
}

const intervals = [30, 14, 7, 3, 1]

let concepts = [
  {id: 0,
    concept: "Master Theorem",
    topic: "Computer Science",
    initialDate: "2025-09-04",
    lastReviewed: "2025-10-05",
    nextReviewDate: todayString(),
    intervalDays: 30,
    repititionsLeft: 1
  }
]
let maxid = 1

app.use(cors());
app.use(express.json());

app.get("/concepts", (req, res) => {
  res.json(concepts)
});

app.get("/concepts/review/today", (req, res) => {

  const today = todayString()

  const toReview = concepts.filter(concept => concept.nextReviewDate == today)

  res.json(toReview)
});

app.post("/concepts/review/:id", (req, res) => {

  const targetId = Number(req.params.id)

  const entry = concepts.find(e => e.id == targetId)

  res.json(toReview)
});

app.post("/concept/add", (req, res) => {
  const {concept, topic, initialDate} = req.body
  const id = maxid + 1
  maxid += 1
  const repititionsLeft = 5
  const nextReviewDate = datePlusDays(intervals[repititionsLeft - 1])
  const newConcept =
  {
    id,
    concept,
    topic,
    initialDate,
    lastReviewed: null,
    nextReviewDate,
    intervalDays: 1,
    repititionsLeft
  }

  concepts.unshift(newConcept)
  res.status(201)
  res.set("Content-Type", "application/json")
  console.log("Sucessfully added concept ", concept)
  res.send(JSON.stringify(newConcept))
})

app.delete("/concept/:id", (req, res) => {
  const targetId = Number(req.params.id);

  const index = concepts.findIndex(concept => concept.id == targetId);

  if (index == -1) {
    res.status(404)
    return JSON.stringify({error: "not found"})
  }

  concepts.splice(index, 1);

  res.set("Content-Type", "application/json")
  console.log("Sucessfully deleted concept with id", targetId)
  res.status(204)
  res.send("")

})


app.listen(3000, () => {
  console.log("API running on port 3000");
});
