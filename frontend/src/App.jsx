import { useState } from 'react'
import Header from "./Header"
import ReviewEntries from './ReviewEntries'
import NewEntryBox from './NewEntryBox'
import InfoBox from "./InfoBox"
import AllEntries from "./AllEntries"

function App() {
  const [entries, setEntries] = useState([]);
  const [currid, setId] = useState(0);

  function addEntry(entry) {
    setEntries( prevEntries => [{id: currid, ...entry}, ... prevEntries])
    setId(prev => prev + 1);
  }

  function deleteEntry(id) {
    console.log("Deleting concept with id ", id)
    setEntries(prevEntries => {
      let newEntries = prevEntries.filter(entry => entry.id != id)
      return newEntries
    });
  }

  return (
    <>
      <div>
        <Header />
        <InfoBox />
        <ReviewEntries deleteFunc={deleteEntry}/>
        <NewEntryBox addFunc={addEntry} />
        <AllEntries entries={entries} deleteFunc={deleteEntry} />
      </div>
    </>
  )
}

export default App
