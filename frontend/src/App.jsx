import { useState } from 'react'
import Header from "./Header"
import ReviewEntries from './ReviewEntries'
import NewEntryBox from './NewEntryBox'
import InfoBox from "./InfoBox"
import AllEntries from "./AllEntries"

function App() {
  return (
    <>
      <div>
        <Header />
        <InfoBox />
        <ReviewEntries />
        <NewEntryBox />
        <AllEntries />
      </div>
    </>
  )
}

export default App
