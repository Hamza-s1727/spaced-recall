import "./Entry.css"
export default function Entry ({topic, concept, initialDate, lastReviewed, nextReviewDate}) {
    return (
        <div className="entryCard">
            <ul className="entryList">
                <li>Concept: <strong>{concept}</strong></li>
                <li>Topic: <strong>{topic}</strong></li>
                <li>You started reviewing this on: <strong>{initialDate}</strong></li>
                <li>You last Reviewed this at: <strong>{lastReviewed}</strong></li>
                <li>You'll review this again on: <strong>{nextReviewDate}</strong></li>
            </ul>
            <div className="entryButtons">
                <button className="reviewButton">Mark as Reviewed</button>
                <button className="deleteButton">Delete Entry</button>
            </div>
        </div>
    )
}