import "./ProfilePage.css"
import quizzes from "../../mock-data/ProfileQuizzes.json"
import { PlusCircle, Trash2 } from "lucide-react"
import { useNavigate, Link } from "react-router"
// import { useContext } from "react"
// import { AuthContext } from "../../lib/AuthContext"
// import { socket } from "../../lib/socket"
import axiosInstance from "../../lib/axiosInstance"

function ProfilePage() {
  const navigate = useNavigate()

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
