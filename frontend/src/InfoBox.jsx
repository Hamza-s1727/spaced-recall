import "./InfoBox.css"

export default function InfoBox() {
    return (
        <div className="infoContainer" >
            <h2>Reviewing Made Easy</h2>
            <p>As you input new concepts, topics, the program will apply spaced repition and tell you which concepts are up for review for the day. The current demo
                contains a variety of concepts from mathematics, statistics and computer science, with a virtual date changer that lets you advance in time. The current
                time is set to January 1, 2025 and you may add or remove entries as needed.
            </p>

            <h2>Implementation</h2>
            <p>The frontend for this project was built in React, and the Backend was built in Express. Deployed with Vercel and Supabase</p>
        </div>
    )
}