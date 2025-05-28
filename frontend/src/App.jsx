import "./App.css"
import { Routes, Route } from "react-router"
import HomePage from "./Pages/HomePage"
import GenerateQuiz from "./Pages/generate-quiz/GenerateQuiz"
import StartedQuiz from "./Pages/started-quiz/StartedQuiz"

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/generateQuiz" element={<GenerateQuiz />} />
      <Route path="/startedQuiz" element={<StartedQuiz />} />
    </Routes>
  )
}

export default App

