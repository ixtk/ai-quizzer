import "./ProfilePage.css"
import quizzes from "../../mock-data/ProfileQuizzes.json"
import { PlusCircle, Play, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router"
import { useContext } from "react"
import { AuthContext } from "../../lib/AuthContext"
import { socket } from "../../lib/socket"
import axiosInstance from "../../lib/axiosInstance"

function ProfilePage() {
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)

  const handleHostGame = async () => {
    const res = await axiosInstance.post("/create-room")
    const roomCode = res.data.roomCode

    navigate(`/lobby/${roomCode}`)
  }
  

  return (
    <div className="container">
      <div className="profile-quizzes">
        <div className="profile card">
          <h1 className="profile-heading">My Profile</h1>
          <p className="profile-text">Manage your quizzes and game history</p>
          <div className="profile-info">
            <div className="profile-icon">D</div>
            <p className="profile-name">demo</p>
            <p className="profile-date">Member Since 11.05.2025</p>
          </div>
        </div>

        <div className="quizzes">
          <div className="my-quizzes">
            <h1>My Quizzes</h1>
            <button className="quizzes-create-btn btn-primary btn">
              <PlusCircle size={20} style={{ marginRight: 6 }} />
              Create New Quiz
            </button>
          </div>

          {quizzes.map((quiz, index) => (
            <div className="quiz card" key={index}>
              <div className="quiz-info-name">
                <p className="quiz-name">{quiz.name}</p>
                <div className="quiz-info">
                  <p>{quiz.number_of_questions} questions</p>
                  <p>Difficulty: {quiz.difficulty}</p>
                  <p className="quiz-info-created">
                    Created: {quiz.date_created}
                  </p>
                </div>
              </div>
              <div className="quiz-actions">
                <button className="btn-primary btn" onClick={handleHostGame}>
                  <Play size={16} />
                  <span className="btn-text">Host Game</span>
                </button>
                <button className="btn-outline btn">
                  <Pencil size={16} />
                  <span className="btn-text">Edit</span>
                </button>
                <button className="btn-outline btn">
                  <Trash2 size={16} />
                  <span className="btn-text">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
