import "./App.css"
import { Routes, Route } from "react-router"
import HomePage from "./Pages/HomePage"
import ProfilePage from "./Pages/ProfilePage/ProfilePage"
function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/Profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default App
