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

/*
FindNextDate:

@totalReviews: int, the number of reviews currently done on a concepts

returns how many days to skip for the next review interval, for example a return
of "30" means the next review will be in 30 days
*/
function findNextDate(totalReviews) {
  const reviews = [1, 3, 7, 14, 30]
  return (0 <= totalReviews && totalReviews <= 4) ? reviews[totalReviews] : 30
}

app.use(cors());
app.use(express.json());

/*
GET REQUEST: "/concepts"

returns all concepts from the table
*/
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


/*
GET REQUEST: "/concepts/review/today"

returns all concepts from table where the next review date is today, in UTC time
*/
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

/*
PATCH REQUEST: "/concepts/review/id"

marks the concept as reviewed in the server, and sets the next review date
*/
app.patch("/concepts/review/:id", async (req, res) => {
  const targetId = Number(req.params.id);

  try {
    const { rows } = await pool.query(
      `
      SELECT
        id,
        repetitions_left AS "repetitionsLeft",
        total_reviews AS "totalReviews"
      FROM concepts
      WHERE id = $1
      `,
      [targetId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "not found" });
    }

    const entry = rows[0];

    if (entry.repetitionsLeft !== null && entry.repetitionsLeft === 1) {
      const del = await pool.query(`DELETE FROM concepts WHERE id = $1`, [targetId]);

      if (del.rowCount === 0) {
        return res.status(404).json({ error: "not found" });
      }

      return res.status(204).send("");
    }

    // 3) Otherwise update review fields
    const nextIntervalDays = findNextDate(entry.totalReviews);
    const { rows: updated } = await pool.query(
      `
      UPDATE concepts
      SET
        last_reviewed = CURRENT_DATE,
        interval_days = $2::int,
        next_review_date = CURRENT_DATE + ($2 * INTERVAL '1 day'),
        total_reviews = total_reviews + 1,
        repetitions_left = CASE
          WHEN repetitions_left IS NULL THEN NULL
          ELSE repetitions_left - 1
        END
      WHERE id = $1
      `,
      [targetId, nextIntervalDays]
    );

    return res.status(200).send("");
  } catch (err) {
    console.error("Error Marking Concept as Reviewed:", err);
    return res.status(500).json({ error: err });
  }
  /*
  OLD IMPLEMENTATION
  const entry = concepts.find(e => e.id == targetId)

  if (entry == undefined) {
    res.status(404)
    return JSON.stringify({error: "not found"})
  }

  if (entry.repetitionsLeft == 1) {
    res.set("Content-Type", "application/json")
    console.log("Total repetitions finished, deleting concept with id ", targetId)
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
    */
});

/*
POST REQUEST: concept/add

adds a new concept to the database
*/
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

/*
DELETE REQUEST: "/concept/id"

deletes the entry from the database
*/
app.delete("/concept/:id", async (req, res) => {
  const targetId = Number(req.params.id);

  const item = await pool.query(
    `
    DELETE FROM concepts where id=$1
    `,
    [targetId]
  )

  if (item.rowcount == 1) {res.status(404).json({error: "not found"})}
  else {res.status(204).send("");}
  

})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log("API running on port", process.env.PORT);
});
