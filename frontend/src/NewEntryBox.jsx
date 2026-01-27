import { useState } from "react";
import "./NewEntryBox.css"

export default function NewEntryBox({ addFunc }) {
  const [concept, setConcept] = useState("");
  const [topic, setTopic] = useState("");
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [repetitions, setRepetitions] = useState("");


  function handleSubmit(e) {
    e.preventDefault();

    const c = concept.trim();
    const t = topic.trim();
    if (!c || !t) return;

    addFunc({ concept: c, topic: t, initialDate: new Date().toISOString().slice(0, 10), lastReviewed: null, nextReviewDate: startDate || Date().toISOString().slice(0, 10), repetitionsLeft: repetitions});

    setConcept("");
    setTopic("");
  }

  return (
    <div className="newEntryCard">
      <div className="newEntryHeader">
        <h2 className="newEntryTitle">Add New Entry</h2>
        <p className="newEntrySubtitle">Create a concept to add to your review queue.</p>
      </div>

      <form className="newEntryForm" onSubmit={handleSubmit}>
        <div className="newEntryField">
          <label className="newEntryLabel" htmlFor="concept">
            Concept
          </label>
          <input
            id="concept"
            className="newEntryInput"
            type="text"
            placeholder="e.g. The Chain Rule"
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
          />
        </div>

        <div className="newEntryField">
          <label className="newEntryLabel" htmlFor="topic">
            Topic
          </label>
          <input
            id="topic"
            className="newEntryInput"
            type="text"
            placeholder="e.g. Calculus"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <label className="newEntryLabel" htmlFor="date">
            Start Reviewing this on:
          </label>
          <input
          id="date"
          className="newEntryInput"
          type="date"
          value={startDate} onChange={(e) => setStartDate(e.target.value)}
          >
          </input>

          <label className="newEntryLabel" htmlFor="repetitions">Total repetitions before deletion (leave blank for infinite)</label>
          <input id="repetitions" className="newEntryInput" type="number" value={repetitions} onChange={(e) => setRepetitions((e.target.value <= 0 & e.target.value != "") ? 1 : e.target.value)}></input>
          <label className="newEntryLabel" htmlFor="repetitions">Note that repetitions will be at a maximum of 30 days apart</label>
        </div>

        <div className="newEntryButtons">
          <button className="newEntryButton" type="submit">
            Add Entry
          </button>
          <button
            className="newEntryButton secondary"
            type="button"
            onClick={() => {
              setConcept("");
              setTopic("");
              
            }}
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}
