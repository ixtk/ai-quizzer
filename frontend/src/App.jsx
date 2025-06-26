import "./App.css"
import { Routes, Route } from "react-router"
import LobbyPage from "./Pages/LobbyPage/LobbyPage"
import ProfilePage from "./Pages/ProfilePage/ProfilePage"
import GenerateQuiz from "./Pages/generate-quiz/GenerateQuiz"
// import StartedQuiz from "./Pages/started-quiz/StartedQuiz"
import HomePage from "./Pages/home-page/HomePage"
// import LeaderBoard from "./Pages/leader-board-page/LeaderBoard"
import Layout from "./shared/Layout"
import QuizFinish from "./Pages/started-quiz/QuizFinish"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/game/:roomCode" element={<LobbyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/generateQuiz" element={<GenerateQuiz />} />
        </Route>
        <Route path="/QuizFinish" element={<QuizFinish />} />
      </Route>
    </Routes>
  )
}

export default App
