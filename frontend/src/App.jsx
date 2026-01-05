import { useState } from 'react'
import Header from "./Header"
import ReviewEntries from './ReviewEntries'
import NewEntryBox from './NewEntryBox'
import InfoBox from "./InfoBox"

function App() {
  return (
    <>
      <div>
        <Header />
        <InfoBox />
        <div className="ReviewEntriesBox">
          <ReviewEntries />
        </div>
        <NewEntryBox />
      </div>
    </>
  )
}

export default App
