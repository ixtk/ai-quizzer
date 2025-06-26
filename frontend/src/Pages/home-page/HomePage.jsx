import "../../App.css"
import "./HomePage.css"
import { Users, Zap, Brain, Clock, Plus } from "lucide-react"
import { useContext, useState } from "react"
import { AuthContext } from "../../lib/AuthContext"
import { useNavigate } from "react-router"
import axiosInstance from "../../lib/axiosInstance"

const HomePage = () => {
  const { user, isLoading } = useContext(AuthContext)
  const isLoggedIn = Boolean(user)
  const navigate = useNavigate()
  const [roomCodeInput, setRoomCodeInput] = useState("")

  if (isLoading) return null

  const handleHostGame = async () => {
    const res = await axiosInstance.post("/create-room")
    const roomCode = res.data.roomCode

    navigate(`/game/${roomCode}`, { state: { isHost: true } })
  }

  const handleJoinGame = () => {
    if (!roomCodeInput) return
    navigate(`/game/${roomCodeInput}`)
  }

  return (
    <div className="container">
      <main className="main-content">
        {/* Page Header */}
        <div className="page-header">
          <span className="top-btn">
            <Zap />
            Powered by Gemini AI
          </span>
          <h1 className="main-title">Create & Play </h1>
          <span className="main-title-black">AI-Generated Quizzes </span>
          <p className="subtitle">
            Generate custom multiple-choice quizzes on any topic with AI, then
            compete with friends in real-time.
          </p>

          {isLoggedIn && (
            <div className="actions">
              <button
                className="btn btn-primary host-game-btn"
                onClick={handleHostGame}
              >
                <Plus size={35} color="white" className="plus-icon" />
                Host a Game
              </button>
              <div className="join-game">
                <input
                  type="text"
                  className="room-input"
                  placeholder="Enter room code"
                  value={roomCodeInput}
                  onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
                />
                <button
                  className="btn btn-outline join-btn"
                  onClick={handleJoinGame}
                >
                  Join
                </button>
              </div>
            </div>
          )}
        </div>

        {/* How It Works Cards */}
        <div className="how-it-works-cards">
          <div className="how-it-works-card">
            <div className="icon-wrapper">
              <Brain size={32} color="white" />
            </div>
            <h3 className="how-it-works-card-title">Generate Quiz</h3>
            <p className="how-it-works-card-desc">
              Enter a topic and difficulty. Gemini AI instantly creates
              multiple-choice questions.
            </p>
          </div>

          <div className="how-it-works-card">
            <div className="icon-wrapper wrapper2">
              <Users size={32} color="white" />
            </div>
            <h3 className="how-it-works-card-title">Host a Game</h3>
            <p className="how-it-works-card-desc">
              Share your 6-digit game code. Everyone joins your real-time lobby.
            </p>
          </div>

          <div className="how-it-works-card">
            <div className="icon-wrapper wrapper3">
              <Clock size={32} color="white" />
            </div>
            <h3 className="how-it-works-card-title">Play & Compete</h3>
            <p className="how-it-works-card-desc">
              Race the timer. Score points for correct answers and climb the
              leaderboard!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HomePage
