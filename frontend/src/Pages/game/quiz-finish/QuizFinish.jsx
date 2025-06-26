import "./QuizFinish.css"
import React, { useState } from "react"
import { Trophy, Hourglass, Users } from "lucide-react"

const QuizFinish = () => {
  return (
    <div className="container">
      <div className="card QuizFinish-card">
        <Hourglass size={80} className="QuizFinish-icons" />
        <h1 className="quiz-finish-heading">Quiz Complete!</h1>
        <p className="waiting-message">
          waiting for other players to finish...
        </p>

        <div className="badge score-badge">
          <h1 className="score-title">
            <Trophy
              size={40}
              className="QuizFinish-icons"
              style={{ marginRight: "1rem" }}
            />
            Your Score
          </h1>
          <h1 className="score-value">14</h1>
          <p className="score-label">points</p>
        </div>
        <div className="players-finished-box">
          <p className="players-finished-label">
            <Users className="QuizFinish-icons" /> Players finished
          </p>
          <p className="players-finished-count">2 of 3</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  )
}

export default QuizFinish
