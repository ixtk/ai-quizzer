import "./App.css"
import { Routes, Route } from "react-router"
import HomePage from "./Pages/HomePage"
import LobbyPage from "./Pages/LobbyPage/LobbyPage"
import ProfilePage from "./Pages/ProfilePage/ProfilePage"
function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/Lobby" element={<LobbyPage />} />
      <Route path="/Profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App
