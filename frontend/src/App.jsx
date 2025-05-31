import "./App.css"
import { Routes, Route } from "react-router"
import HomePage from "./Pages/HomePage"
import LobbyPage from "./Pages/LobbyPage/LobbyPage"
import ProfilePage from "./Pages/ProfilePage/ProfilePage"
import GenerateQuiz from "./Pages/generate-quiz/GenerateQuiz"
import StartedQuiz from "./Pages/started-quiz/StartedQuiz"

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/Lobby" element={<LobbyPage />} />
      <Route path="/Profile" element={<ProfilePage />} />
      <Route path="/generateQuiz" element={<GenerateQuiz />} />
      <Route path="/startedQuiz" element={<StartedQuiz />} />
    </Routes>
  )
}

export default App
