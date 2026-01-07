import { useState } from "react"
import Entry from "./Entry"
import "./ReviewEntries.css"

export default function ReviewEntries () {
    const [open, setOpen] = useState(false);

    return (
        <>
        <div className="reviewEntriesContainer">
        <button className="reviewEntriesButton" onClick={() => {setOpen(!open)}}>View All Entries in Database</button>
        </div>
        <div className="EntriesBox">
            {open && <div className="EntriesBox">
            <Entry 
            concept="The Master Theorem"
            topic="Computer Science"
            initialDate="September 4, 2024"
            lastReviewed="October 5, 2025"
            nextReviewDate="November 5, 2025"
            reviewable={false}
            />

             <Entry 
            concept="The Master Theorem"
            topic="Computer Science"
            initialDate="September 4, 2024"
            lastReviewed="October 5, 2025"
            nextReviewDate="November 5, 2025"
            reviewable={false}
            />
            </div>}
        </div>
        </>
    )
}