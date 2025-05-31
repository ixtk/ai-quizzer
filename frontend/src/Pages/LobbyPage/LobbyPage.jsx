import { Link } from "react-router"
import { ArrowLeft, Copy, Users, CircleCheckBig, Loader } from "lucide-react"
import players from "../../mock_data/LobbyUsers.json"
import "./LobbyPage.css"

function LobbyPage() {
  return (
    <div className="container">
      <Link to="/" className="home-link">
        <ArrowLeft />
        Back to Home
      </Link>
      <div className="lobby-page">
        <div className=" card lobby-section">
          <h1 className="lobby-title">Game Lobby</h1>
          <p className="lobby-subtitle">Waiting for players to get ready</p>

          <div className="game-code-section card">
            <p className="game-code-label">Game Code</p>
            <h1 className="game-code">ABCD1234</h1>
            <button className="copy-button btn btn-outline">
              <Copy style={{ "margin-right": "1rem" }} /> Copy Game Link
            </button>
          </div>
          <p className="player-count">
            <Users style={{ "margin-right": "0.5rem" }} /> Players (
            {players.length}/8)
          </p>

          <div className="player-list">
            {players.map((player, index) => (
              <div key={index} className="player-item card">
                <div className="player-info">
                  <div className="player-avatar">{player.name.charAt(0)}</div>
                  <p className="player-name">{player.name}</p>
                  {player.host && (
                    <div className="host-badge">
                      <p>Host</p>
                    </div>
                  )}
                </div>

                {player.ready ? (
                  <div className="ready-status ready">
                    <CircleCheckBig style={{ "margin-right": "0.5rem" }} />{" "}
                    Ready
                  </div>
                ) : (
                  <div className="ready-status not-ready">
                    <Loader style={{ "margin-right": "0.5rem" }} /> Not Ready
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="quiz-section">
          <div className="quiz-badge card">
            <h1>Select Your Quiz</h1>
            <p>Choose a quiz to use in the game</p>
            <select className="quiz-input btn btn-outline">
              <option value="">Select a quiz</option>
              <option value="quiz1">General Knowledge</option>
              <option value="quiz2">Science & Nature</option>
              <option value="quiz3">History</option>
              <option value="quiz4">Sports</option>
            </select>
            <button className="randomize-button btn btn-outline">
              Randomize
            </button>
          </div>
          <button className="start-game-button btn btn-primary">
            Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

export default LobbyPage
