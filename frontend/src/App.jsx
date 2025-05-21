import "./App.css"
import { Routes, Route } from "react-router"
import HomePage from "./Pages/HomePage"
import GenerateQuiz from "./Pages/generate-quiz/GenerateQuiz"

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/generateQuiz" element={<GenerateQuiz />} />
    </Routes>
  )
}

export default App


