import express from "express";
import cors from "cors";
import pg from "pg"
import dotenv from "dotenv"

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 10_000,
  connectionTimeoutMillis: 10_000,
});


const app = express();
console.log("DATABASE_URL host:", new URL(process.env.DATABASE_URL).host);


function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function datePlusDays(days) {
  function addPadding(n) {
    return n < 10 ? "0" + n : String(n)
  }
  const d = new Date();
  d.setDate(d.getDate() + days + 1);

  const yyyy = d.getFullYear();
  const mm = addPadding(d.getMonth() + 1)
  const dd = addPadding(d.getDate())

  return `${yyyy}-${mm}-${dd}`;
}

function findNextDate(totalReviews) {
  const reviews = [1, 3, 7, 14, 30]
  return (0 <= totalReviews && totalReviews <= 4) ? reviews[totalReviews] : 30
}

let concepts = [
  {id: 0,
    concept: "Cauchy Sequences: Definition",
    topic: "Real Analysis",
    initialDate: "2025-09-04",
    lastReviewed: "2025-10-05",
    nextReviewDate: todayString(),
    intervalDays: 30,
    repetitionsLeft: 1,
    totalReviews: 2
  }
]
let maxid = 1
app.get("/health/db", async (req, res) => {
  try {
    const { rows } = await pool.query("select 1 as ok");
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


app.use(cors());
app.use(express.json());

app.get("/concepts", async (req, res) => {
  //res.json(concepts) <-- local storage version  
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        concept,
        topic,
        to_char(initial_date, 'YYYY-MM-DD') AS "initialDate",
        CASE
          WHEN last_reviewed IS NULL THEN NULL
          ELSE to_char(last_reviewed, 'YYYY-MM-DD')
        END AS "lastReviewed",
        to_char(next_review_date, 'YYYY-MM-DD') AS "nextReviewDate",
        interval_days AS "intervalDays",
        repetitions_left AS "repetitionsLeft",
        total_reviews AS "totalReviews"
      FROM concepts
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET /concepts DB error:", err);
    res.status(500).json(err)
  }
});




app.get("/concepts/review/today", async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        id,
        concept,
        topic,
        to_char(initial_date, 'YYYY-MM-DD') AS "initialDate",
        CASE
          WHEN last_reviewed IS NULL THEN NULL
          ELSE to_char(last_reviewed, 'YYYY-MM-DD')
        END AS "lastReviewed",
        to_char(next_review_date, 'YYYY-MM-DD') AS "nextReviewDate",
        interval_days AS "intervalDays",
        repetitions_left AS "repetitionsLeft",
        total_reviews AS "totalReviews"
      FROM concepts
      WHERE next_review_date = CURRENT_DATE
      ORDER BY id DESC
    `);

    return res.json(rows);
  } catch (err) {
    console.log("reviewing get error:", err);
    return res.status(500).json({ error: err.message });
  }
});


app.patch("/concepts/review/:id", (req, res) => {

  const targetId = Number(req.params.id)

  const entry = concepts.find(e => e.id == targetId)

  if (entry == undefined) {
    res.status(404)
    return JSON.stringify({error: "not found"})
  }

  if (entry.repetitionsLeft == 1) {
    res.set("Content-Type", "application/json")
    console.log("Total repititions finished, deleting concept with id ", targetId)
    const index = concepts.findIndex(concept => concept.id == targetId);
    concepts.splice(index, 1);
    res.status(204)
    res.send("")
  }
  else {
    entry.repetitionsLeft--;
    console.log("repetitions left", entry.repetitionsLeft)
    entry.lastReviewed = todayString()
    console.log("last reviewed ", entry.lastReviewed)
    entry.nextReviewDate = datePlusDays(findNextDate(entry.totalReviews))
    entry.totalReviews++;
    console.log("reviews next: ", entry.nextReviewDate)
    res.status(201)
    res.send("")
  }
});

app.post("/concept/add", async (req, res) => {
  const {concept, topic, initialDate, nextReviewDate, repetitionsLeft} = req.body
  const reps = repetitionsLeft === "" ? null : Number(repetitionsLeft);
  try {
    const { rows } = await pool.query(
      `
      INSERT INTO concepts
        (concept, topic, initial_date, last_reviewed, next_review_date, interval_days, repetitions_left, total_reviews)
      VALUES
        ($1, $2, $3::date, NULL, $4::date, 1, $5::int, 0)
      RETURNING
        id,
        concept,
        topic,
        to_char(initial_date, 'YYYY-MM-DD') AS "initialDate",
        NULL AS "lastReviewed",
        to_char(next_review_date, 'YYYY-MM-DD') AS "nextReviewDate",
        interval_days AS "intervalDays",
        repetitions_left AS "repetitionsLeft",
        total_reviews AS "totalReviews"
      `,
      [concept, topic, initialDate, nextReviewDate, reps]
    );
    res.status(201).json(rows[0]);
  }
  catch (err) {
    console.error(" it dont work:", err);
    res.status(500).json(err)
  }
  /*
  OLD IMPLEMENTATION
  const newConcept =
  {
    id,
    concept,
    topic,
    initialDate,
    lastReviewed: null,
    nextReviewDate,
    intervalDays: 1,
    repetitionsLeft,
    totalReviews
  }
  concepts.unshift(newConcept)
  res.status(201)
  res.set("Content-Type", "application/json")
  console.log("Sucessfully added concept ", concept)
  res.send(JSON.stringify(newConcept))
  */
})

app.delete("/concept/:id", async (req, res) => {
  const targetId = Number(req.params.id);

  const item = await pool.query(
    `
    DELETE FROM concepts where id=$1
    `,
    [targetId]
  )

  if (item.rowcount == 1) {res.status(404).json({error: "not found"})}
  else {res.status(204).json();}
  

})


app.listen(3000, () => {
  console.log("API running on port 3000");
});
