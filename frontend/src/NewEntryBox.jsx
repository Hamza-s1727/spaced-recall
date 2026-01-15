import { useState } from "react";
import "./NewEntryBox.css"

export default function NewEntryBox({ addFunc }) {
  const [concept, setConcept] = useState("");
  const [topic, setTopic] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const c = concept.trim();
    const t = topic.trim();
    if (!c || !t) return;

    addFunc({ concept: c, topic: t, initialDate: new Date().toISOString().slice(0, 10), lastReviewed: null, nextReviewDate: "2025-01-02" });

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
            placeholder="e.g., Master Theorem"
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
            placeholder="e.g., Computer Science"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
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
