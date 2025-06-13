import "./App.css"
import { Routes, Route } from "react-router"
import LobbyPage from "./Pages/LobbyPage/LobbyPage"
import ProfilePage from "./Pages/ProfilePage/ProfilePage"
import GenerateQuiz from "./Pages/generate-quiz/GenerateQuiz"
import StartedQuiz from "./Pages/started-quiz/StartedQuiz"
import HomePage from "./Pages/home-page/HomePage"
import LeaderBoard from "./Pages/leader-board-page/LeaderBoard"

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/Lobby" element={<LobbyPage />} />
      <Route path="/Profile" element={<ProfilePage />} />
      <Route path="/generateQuiz" element={<GenerateQuiz />} />
      <Route path="/startedQuiz" element={<StartedQuiz />} />
      <Route path="/LeaderBoard" element={<LeaderBoard />} />
    </Routes>
  )
}

export default App
