import React, { useState } from "react"
import { Clock } from "lucide-react"
import "../../App.css"
import "./StartedQuiz.css"
import questionsData from "../../../mock-data/questions.json"

function StartedQuiz() {
  const [current, setCurrent] = useState(0)
  const total = questionsData.length

  const handleNext = () => {
    if (current < total - 1) {
      setCurrent(current + 1)
    }
  }

  const progressPercent = ((current + 1) / total) * 100

  const q = questionsData[current]

  return (
    <div className="container">
      <div className="card">
        <header className="sq-header">
          <div>
            <h1 className="sq-title">World Geography</h1>
            <p className="sq-subtitle">
              Question {current + 1} of {total}
            </p>
          </div>
          <div className="sq-timer">
            <Clock size={20} /> 00:13
          </div>
        </header>
        <div className="sq-progress-bar">
          <div
            className="sq-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="sq-question-box">
          <p className="sq-question-text">{q.text}</p>
          <div className="sq-options">
            {q.options.map((opt, i) => (
              <button key={i} className="sq-option-btn">
                <div className="sq-opt-letter">
                  {String.fromCharCode(65 + i)}
                </div>
                <span>{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
        <footer className="sq-footer">
          <button className="score-btn btn-outline">
            Score: <span className="score-count">0</span>
          </button>
          <div className="btn-div">
            <button
              className="btn btn-outline sq-btn-next"
              onClick={handleNext}
              disabled={current === total - 1}
            >
              Next
            </button>
            <button className="btn btn-primary sq-btn-submit">
              Submit Answer
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}
export default StartedQuiz
