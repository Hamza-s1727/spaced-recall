import { useState } from "react";
import Entry from "./Entry";
import "./ReviewEntries.css";

export default function AllEntries({ entries = [], deleteFunc}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="reviewEntriesContainer">
        <button
          className="reviewEntriesButton"
          onClick={() => setOpen(!open)}
        >
          View Entries for Today
        </button>
      </div>
      <div className="entriesBox">
        {open && (
          <div className="entriesBox">
            {entries.length === 0 ? (
              <p className="emptyState">You havent added any concepts!</p>
            ) : (
              entries.map((e) => (
                <Entry
                  concept={e.concept}
                  topic={e.topic}
                  initialDate={e.initialDate}
                  lastReviewed={e.lastReviewed}
                  nextReviewDate={e.nextReviewDate}
                  id={e.id}
                  reviewable={false}
                  deleteFunc={deleteFunc}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
