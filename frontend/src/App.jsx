import { useEffect, useState } from 'react'
import Header from "./Header"
import ReviewEntries from './ReviewEntries'
import NewEntryBox from './NewEntryBox'
import InfoBox from "./InfoBox"
import AllEntries from "./AllEntries"

function App() {
  const API = "http://localhost:3000"
  const [entries, setEntries] = useState([]);
  const [revEntries, setRevEntries] = useState([]);

  useEffect(() => {
    loadEntries();
  }, [])

  async function loadEntries() {
    const res = await fetch(`${API}/concepts`);
    const data = await res.json()
    setEntries(data);
    console.log("loaded entries:", data.map(x => x.id));

    const revRes = await fetch(`${API}/concepts/review/today`)
    const revData = await revRes.json()
    setRevEntries(revData)
    console.log("loaded reviewable entries:", revData.map(x => x.id));

  }

  async function addEntry(entry) {
    const res = await fetch("http://localhost:3000/concept/add", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    } )
    await loadEntries();
  }

  async function deleteEntry(id) {
    const res = await fetch(`${API}/concept/${id}`, {
      method: 'DELETE',
    } )
    await loadEntries();
  }

  async function reviewEntry(id) {
    const res = await fetch(`${API}/concepts/review/${id}`, {
      method: 'PATCH',
    } )
    await loadEntries();
  }

  return (
    <>
      <div>
        <Header />
        <InfoBox />
        <ReviewEntries entries={revEntries} deleteFunc={deleteEntry} reviewFunc={reviewEntry}/>
        <NewEntryBox addFunc={addEntry} />
        <AllEntries entries={entries} deleteFunc={deleteEntry} />
      </div>
    </>
  )
}

export default App
