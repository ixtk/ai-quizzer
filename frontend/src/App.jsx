import "./App.css"
import { Routes, Route } from "react-router"
import HomePage from "./Pages/HomePage"

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
    </Routes>
  )
}

export default App

