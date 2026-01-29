import "./InfoBox.css"

export default function InfoBox() {
  return (
    <div className="infoContainer">
      <h2>Reviewing Made Easy</h2>
      <p>
        This project provides support for retaining knowledge effectively via
        <strong> spaced repetition</strong>. Add new concepts and topics,
        the system will schedules future reviews based on how many times
        you’ve already seen the material, surfacing only the concepts that are
        due on a given day.
      </p>

      <h2>Reviewing Setup</h2>
      <p>
        Each concept starts with short review intervals that gradually increase
        over time as the material is reinforced. The current implementation will
        begin with an interval of 1 day, followed by 3 days, 7 days, 14 days, and 
        30 days. Further Repetitions will continue 30 days later.
      </p>

      <h2>Implementation</h2>
      <p>
        The frontend is built with React, the backend is an
        Express API backed by PostgreSQL. It is recommended to use 
        Supabase to prevent compatibility issues. 
        </p>
    </div>
  )
}
