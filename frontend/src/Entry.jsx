import "./Entry.css"
export default function Entry ({id, topic, concept, initialDate, lastReviewed, nextReviewDate, reviewable = true, deleteFunc}) {

    function handleSubmit(e) {
        e.preventDefault()
        deleteEntry()
    }

    async function deleteEntry() {
        const res = await fetch(`http://localhost:3000/concept/${id}`, {
            method: 'DELETE',
            } )
        const data = await res.json();
        console.log(JSON.stringify(data))
        console.log("status ", res.status)
    }

    return (
        <div className="entryCard">
            <ul className="entryList">
                <li>Concept: <strong>{concept}</strong></li>
                <li>Topic: <strong>{topic}</strong></li>
                <li>You started reviewing this on: <strong>{initialDate}</strong></li>
                <li>You last Reviewed this at: <strong>{lastReviewed ? lastReviewed : "Never"}</strong></li>
                <li>You'll review this again on: <strong>{nextReviewDate}</strong></li>
                <li>key: {id}</li>
            </ul>
            <div className="entryButtons">
                <form className="deleteEntryForm" onSubmit={handleSubmit}>
                {reviewable && <button className="reviewButton">Mark as Reviewed</button>}
                <button onClick={() => deleteFunc(id)} className="deleteButton">Delete Entry</button>
                </form>
            </div>
        </div>
    )
}