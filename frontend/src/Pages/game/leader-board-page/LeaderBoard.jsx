import "../../../App.css"
import "./LeaderBoard.css"
import React, { useState } from "react"
import { Trophy, RefreshCw, Home, Check } from "lucide-react"
import questions from "../../../mock-data/questions.json"

const LeaderBoard = () => {
  const [selectedTab, setSelectedTab] = useState("leaderboard")

  const players = [
    { name: "Alex", points: 35, initial: "A", color: "grey" },
    { name: "You", points: 42, initial: "Y", color: "purple" },
    { name: "Taylor", points: 28, initial: "T", color: "orange" }
  ]
  return (
    <div className="leaderboard card container">
      <div className="leaderboard-header">
        <div className="trophy-div">
          <Trophy className="trophy-icon" />
        </div>
        <p className="title">Quiz Complete!</p>
        <p className="subtext">Final Results</p>
      </div>
      <div className="tab-buttons">
        <button
          className={`tab-btn ${selectedTab === "leaderboard" ? "active" : ""}`}
          onClick={() => setSelectedTab("leaderboard")}
        >
          Leaderboard
        </button>
        <button
          className={`tab-btn ${
            selectedTab === "questionStats" ? "active" : ""
          }`}
          onClick={() => setSelectedTab("questionStats")}
        >
          Question Stats
        </button>
      </div>

      <div className="tab-content">
        {selectedTab === "leaderboard" && (
          <div className="leaderboard-side">
            {players.map((player, index) => (
              <div key={index} className="player">
                <div className={`circle ${player.color}`}>{player.initial}</div>

                <div className="name">{player.name}</div>
                <div className={`points ${player.name}`}>
                  {player.points} pts
                </div>
                {player.name === "You" && <div className="winner">Winner!</div>}
              </div>
            ))}
          </div>
        )}

        {selectedTab === "questionStats" && (
          <div className="quiz-container">
            {questions.map((q, index) => (
              <div key={q.id} className="question-block">
                <h3>
                  Question {index + 1}: {q.text}
                </h3>
                <div className="options-grid">
                  {q.options.map((opt, i) => {
                    const isCorrect = opt.text === q.correct
                    return (
                      <div
                        key={i}
                        className={`option-card ${isCorrect ? "correct" : ""}`}
                      >
                        {isCorrect && (
                          <Check className="check-icon" size={20} />
                        )}
                        <strong>{String.fromCharCode(65 + i)}.</strong>{" "}
                        {opt.text}
                        {opt.selectedBy.length > 0 && (
                          <div className="selected-by">
                            Selected by: {opt.selectedBy.join(", ")}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="leaderboard-actions">
        <button className="btn btn-primary">
          <RefreshCw size={24} style={{ marginRight: "0.8rem" }} />
          Play Again
        </button>
        <button className="btn btn-outline">
          <Home size={24} style={{ marginRight: "0.8rem" }} />
          Back to Home
        </button>
      </div>
    </div>
  )
}

export default LeaderBoard
