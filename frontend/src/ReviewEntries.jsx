import { useState } from "react";
import Entry from "./Entry";
import "./ReviewEntries.css";

export default function ReviewEntries({ entries = [], deleteFunc, reviewFunc}) {
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
              <p className="emptyState">You are done for today!</p>
            ) : (
              entries.map((e) => (
                <Entry
                  concept={e.concept}
                  topic={e.topic}
                  initialDate={e.initialDate}
                  lastReviewed={e.lastReviewed}
                  nextReviewDate={e.nextReviewDate}
                  repetitionsLeft={e.repetitionsLeft}
                  id={e.id}
                  deleteFunc={deleteFunc}
                  reviewFunc={reviewFunc}
                />
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}
