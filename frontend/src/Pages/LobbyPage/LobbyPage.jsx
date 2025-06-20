import { Link, useParams } from "react-router"
import { useEffect, useState, useContext } from "react"
import { ArrowLeft, Copy, Users, CircleCheckBig, Loader } from "lucide-react"
import "./LobbyPage.css"
import { socket } from "../../lib/socket"
import { AuthContext } from "../../lib/AuthContext"

function LobbyPage() {
  const { user, isLoading } = useContext(AuthContext)
  const { roomCode } = useParams()
  const [players, setPlayers] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState("")
  const [hostId, setHostId] = useState("")
  const [mySocketId, setMySocketId] = useState("")

  const quizOptions = [
    { id: "quiz1", name: "General Knowledge" },
    { id: "quiz2", name: "Science & Nature" },
    { id: "quiz3", name: "History" },
    { id: "quiz4", name: "Sports" }
  ]

  // Prevent crashing on refresh or unauthenticated access
  useEffect(() => {
    if (!user?.username) return

    const isHost = localStorage.getItem("isHost") === "true"

    const joinRoom = () => {
      if (isHost) {
        socket.emit("host-join-room", { roomCode })
      } else {
        socket.emit("join-room", { roomCode })
      }
    }

    if (!socket.connected) {
      socket.auth = { username: user.username }
      socket.connect()
      socket.once("connect", joinRoom)
    } else {
      joinRoom()
    }

    return () => {
      localStorage.removeItem("isHost")
    }
  }, [roomCode, user?.username])

  // Track your own socket ID reliably
  useEffect(() => {
    if (socket.connected) {
      setMySocketId(socket.id)
    } else {
      socket.once("connect", () => setMySocketId(socket.id))
    }
  }, [])

  // Listen for room events
  useEffect(() => {
    socket.on("user-joined", ({ users, hostId }) => {
      setPlayers(users)
      setHostId(hostId)
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
  }, [])

  const handleToggleReady = () => {
    socket.emit("toggle-ready", { roomCode })
  }

  const handleRandomize = () => {
    const random = quizOptions[Math.floor(Math.random() * quizOptions.length)]
    setSelectedQuiz(random.id)
  }

  if (isLoading || !user) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      <Link to="/" className="home-link">
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

        <div className="quiz-section">
          <div className="quiz-badge card">
            <h1>Select Your Quiz</h1>
            <p>Choose a quiz to use in the game</p>

            <select
              className="quiz-input btn btn-outline"
              value={selectedQuiz}
              onChange={e => setSelectedQuiz(e.target.value)}
            >
              <option value="">Select a quiz</option>
              {quizOptions.map(quiz => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.name}
                </option>
              ))}
            </select>

            <button
              className="randomize-button btn btn-outline"
              onClick={handleRandomize}
            >
              Randomize
            </button>
          </div>

          {mySocketId === hostId && (
            <button className="start-game-button btn btn-primary">
              Start Game
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LobbyPage
