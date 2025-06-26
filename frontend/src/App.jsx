import "./App.css"
import { Routes, Route } from "react-router"
import GamePage from "./Pages/game/game-page/GamePage"
import ProfilePage from "./Pages/ProfilePage/ProfilePage"
import GenerateQuiz from "./Pages/generate-quiz/GenerateQuiz"
import StartedQuiz from "./Pages/game/started-quiz/StartedQuiz"
import HomePage from "./Pages/home-page/HomePage"
import LeaderBoard from "./Pages/game/leader-board-page/LeaderBoard"
import Layout from "./shared/Layout"
import QuizFinish from "./Pages/started-quiz/QuizFinish"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/game/:roomCode" element={<GamePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/generateQuiz" element={<GenerateQuiz />} />
      </Route>
    </Routes>
  )
}

export default App
