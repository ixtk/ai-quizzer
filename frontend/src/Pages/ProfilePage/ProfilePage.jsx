import "./ProfilePage.css"
import quizzes from "../../mock-data/ProfileQuizzes.json"
import { PlusCircle, Play, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"
import { useContext } from "react"
import { AuthContext } from "../../lib/AuthContext"
import axiosInstance from "../../lib/axiosInstance"

function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const handleHostGame = async () => {
    const res = await axiosInstance.post("/create-room")
    const roomCode = res.data.roomCode

    navigate(`/game/${roomCode}`, { state: { isHost: true } })
  }

  return (
    <div className="container">
      <div className="profile-quizzes">
        <div className="profile card">
          <h1 className="profile-heading">My Profile</h1>
          <p className="profile-text">Manage your quizzes</p>
          <div className="profile-info">
            <div className="profile-icon">D</div>
            <p className="profile-name">demo</p>
            <p className="profile-date">Member Since 11.05.2025</p>
          </div>
        </div>

        <div className="quizzes">
          {/* Additional code for quizzes will go here */}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
