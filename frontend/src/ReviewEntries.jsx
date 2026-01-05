import { useState } from "react"
import Entry from "./Entry"
import "./ReviewEntries.css"

export default function ReviewEntries () {
    const [open, setOpen] = useState(false);

    return (
        <>
        <div className="reviewEntriesContainer">
        <button className="reviewEntriesButton" onClick={() => {setOpen(!open)}}>View Entries for Today</button>
        </div>
        {open && <div className="entriesBox">
            <Entry 
            concept="The Master Theorem"
            topic="Computer Science"
            initialDate="September 4, 2024"
            lastReviewed="October 5, 2025"
            nextReviewDate="November 5, 2025"
            />

             <Entry 
            concept="The Master Theorem"
            topic="Computer Science"
            initialDate="September 4, 2024"
            lastReviewed="October 5, 2025"
            nextReviewDate="November 5, 2025"
            />

        </div>}
        </>
    )
}