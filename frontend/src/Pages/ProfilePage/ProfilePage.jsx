import "./ProfilePage.css"
import quizzes from "../../mock_data/ProfilePage.json"
import { PlusCircle, Play, Pencil, Trash2 } from "lucide-react"

function Quizzes() {
  console.log(quizzes)
  return (
    <>
      <div className="header">
        <h1 className="AI-Quizzer">AI Quizzer</h1>
        <div className="name-icon">
          <p className="name">demo</p>
          <div className="icon">D</div>
        </div>
      </div>

      <div className="profile-quizzes">
        <div className="profile card container">
          <h1 className="profile-heading">My Profile</h1>
          <p className="profile-text">Manage your quizzes and game history</p>
          <div className="profile-info">
            <div className="profile-icon">D</div>
            <p className="profile-name">demo</p>
            <p className="profile-date">Member Since 11.05.2025</p>
          </div>
        </div>

        <div className="quizzes container">
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
                  <p>Created: {quiz.date_created}</p>
                </div>
              </div>
              <div className="quiz-actions">
                <button className="btn-primary btn">
                  <Play size={16} style={{ marginRight: 4 }} />
                  <span className="btn-text">Host Game</span>
                </button>

                <button className="btn-outline btn">
                  <Pencil size={16} style={{ marginRight: 4 }} />
                  <span className="btn-text">Edit</span>
                </button>

                <button className="btn-outline btn">
                  <Trash2 size={16} style={{ marginRight: 4 }} />
                  <span className="btn-text">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Quizzes
