import { Link, useParams, useLocation, useNavigate } from "react-router"
import { useEffect, useState, useContext } from "react"
import { ArrowLeft, Copy, Users, CircleCheckBig, Loader } from "lucide-react"
import "./GamePage.css"
import { socket } from "../../../lib/socket"
import { AuthContext } from "../../../lib/AuthContext"
import axiosInstance from "../../../lib/axiosInstance"
import StartedQuiz from "../started-quiz/StartedQuiz"
import LeaderBoard from "../leader-board-page/LeaderBoard"
import QuizFinish from "../quiz-finish/QuizFinish"

function GamePage() {
  const { user, isLoading } = useContext(AuthContext)
  const { roomCode } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [isHost, setIsHost] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("lobbyState"))
    return location.state?.isHost ?? saved?.isHost ?? false
  })

  const [players, setPlayers] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [quizzes, setQuizzes] = useState([])
  const [hostId, setHostId] = useState("")
  const [mySocketId, setMySocketId] = useState("")
  const [phase, setPhase] = useState("lobby")

  useEffect(() => {
    socket.on("phase-changed", ({ newPhase }) => {
      setPhase(newPhase)
    })
    return () => socket.off("phase-changed")
  }, [])

  useEffect(() => {
    if (!user?.username) return

    const join = () => {
      if (isHost) {
        socket.emit("host-join-room", { roomCode })
      } else {
        socket.emit("join-room", { roomCode })
      }
      localStorage.setItem("lobbyState", JSON.stringify({ roomCode, isHost }))
    }

    socket.auth = { username: user.username }

    if (!socket.connected) {
      socket.connect()
      socket.once("connect", join)
    } else {
      join()
    }
  }, [roomCode, user?.username, isHost])

  useEffect(() => {
    if (socket.connected) {
      setMySocketId(socket.id)
    } else {
      socket.once("connect", () => setMySocketId(socket.id))
    }
  }, [])

  useEffect(() => {
    socket.on("user-joined", ({ users, hostId }) => {
      setPlayers(users)
      setHostId(hostId)

      if (socket.id && socket.id === hostId) {
        setIsHost(true)
        localStorage.setItem(
          "lobbyState",
          JSON.stringify({ roomCode, isHost: true })
        )
      } else {
        setIsHost(false)
      }
    })

    socket.on("user-disconnected", ({ users, hostId }) => {
      setPlayers(users)
      setHostId(hostId)
    })

    socket.on("ready-updated", ({ users }) => {
      setPlayers(users)
    })

    return () => {
      socket.off("user-joined")
      socket.off("user-disconnected")
      socket.off("ready-updated")
    }
  }, [roomCode])

  useEffect(() => {
    if (!user || !isHost) return

    const fetchQuizzes = async () => {
      try {
        const response = await axiosInstance.get("/quizzes")
        setQuizzes(response.data)
      } catch (err) {
        console.error("❌ Failed to fetch quizzes:", err)
      }
    }

    fetchQuizzes()
  }, [user, isHost])

  const handleToggleReady = () => {
    socket.emit("toggle-ready", { roomCode })
  }

  const handleRandomize = () => {
    const random = quizzes[Math.floor(Math.random() * quizzes.length)]
    setSelectedQuiz(random)
  }

  const handleLeave = () => {
    localStorage.removeItem("lobbyState")
    navigate("/")
  }

  const handleStartGame = () => {
    if (!selectedQuiz) return
    socket.emit("game-started", {
      roomCode,
      selectedQuizId: selectedQuiz._id
    })
  }

  const allReady = players.length > 0 && players.every(p => p.ready)

  if (isLoading || !user) {
    return <div className="container">Loading...</div>
  }

  if (phase === "gameOngoing")
    return <StartedQuiz selectedQuiz={selectedQuiz} roomCode={roomCode} />
  if (phase === "gameOver") return <LeaderBoard />
  if (phase === "waitingForOthers") return <QuizFinish />
  return (
    <div className="container">
      <Link to="/" className="home-link" onClick={handleLeave}>
        <ArrowLeft />
        Back to Home
      </Link>

      <div className="lobby-page">
        <div className="card lobby-section">
          <h1 className="lobby-title">Game Lobby</h1>
          <p className="lobby-subtitle">Waiting for players to get ready</p>

          <div className="game-code-section card">
            <p className="game-code-label">Game Code</p>
            <h1 className="game-code">{roomCode}</h1>
            <button
              className="copy-button btn btn-outline"
              onClick={() => navigator.clipboard.writeText(roomCode)}
            >
              <Copy style={{ marginRight: "1rem" }} /> Copy Game Code
            </button>
          </div>

          <p className="player-count">
            <Users style={{ marginRight: "0.5rem" }} /> Players (
            {players.length}/8)
          </p>

          <div className="player-list">
            {players.map(player => (
              <div key={player.sId} className="player-item card">
                <div className="player-info">
                  <div className="player-avatar">
                    {player.username.charAt(0)}
                  </div>
                  <p className="player-name">{player.username}</p>
                  {player.sId === hostId && (
                    <div className="host-badge">
                      <p>Host</p>
                    </div>
                  )}
                </div>

                {player.ready ? (
                  <div className="ready-status ready">
                    <CircleCheckBig style={{ marginRight: "0.5rem" }} /> Ready
                  </div>
                ) : (
                  <div className="ready-status not-ready">
                    <Loader style={{ marginRight: "0.5rem" }} /> Not Ready
                  </div>
                )}

                {player.sId === mySocketId && (
                  <button
                    className="btn btn-outline ready-toggle-btn"
                    onClick={handleToggleReady}
                  >
                    {player.ready ? "Not Ready" : "Ready"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {isHost && (
          <div className="quiz-section">
            <div className="quiz-badge card">
              <h1>Select Your Quiz</h1>
              <p>Choose a quiz to use in the game</p>

              <select
                className="quiz-input btn btn-outline"
                value={selectedQuiz?.title || ""}
                onChange={e => {
                  const selected = quizzes.find(q => q.title === e.target.value)
                  setSelectedQuiz(selected || null)
                }}
              >
                <option value="">Select a quiz</option>
                {quizzes.map(q => (
                  <option key={q._id} value={q.title}>
                    {q.title}
                  </option>
                ))}
              </select>

              <button
                className="randomize-button btn btn-outline"
                onClick={handleRandomize}
                disabled={quizzes.length === 0}
              >
                Randomize
              </button>
            </div>

            {mySocketId === hostId && (
              <>
                <button
                  className="start-game-button btn btn-primary"
                  onClick={handleStartGame}
                  disabled={!allReady || !selectedQuiz}
                >
                  Start Game
                </button>
                {!allReady && (
                  <p className="helper-text">
                    All players must be ready to start the game
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GamePage
