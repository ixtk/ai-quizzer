import React, { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import "../../../App.css"
import "./StartedQuiz.css"
import { socket } from "../../../lib/socket"
import questionsData from "../../../mock-data/questions.json"

function StartedQuiz({ roomCode, selectedQuiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  const handleNext = () => {
    if (currentQuestionIndex < total - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }
  const total = questionsData.length
  const q = questionsData[currentQuestionIndex]
  const progressPercent = ((currentQuestionIndex + 1) / total) * 100

  useEffect(() => {
    const handleAnswerSelected = ({ answers }) => {
      console.log("[✅] Answer confirmed by backend:", answers)

      setCurrentQuestionIndex(index => {
        const next = index + 1
        if (next < questionsData.length) {
          return next
        } else {
          console.log("🎉 Quiz complete")
          return index
        }
      })

      setSelectedAnswer(null)
    }

    socket.on("answer-selected", handleAnswerSelected)
    return () => socket.off("answer-selected", handleAnswerSelected)
  }, [])

  const handleSubmit = () => {
    if (!selectedAnswer) return

    socket.emit("select-answer", {
      selected: selectedAnswer,
      roomCode
    })
  }

  if (!q) {
    return (
      <div className="container">
        <p>No more questions.</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <header className="sq-header">
          <div>
            <h1 className="sq-title">World Geography</h1>
            <p className="sq-subtitle">
              Question {currentQuestionIndex + 1} of {total}
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
            {q.options.map((opt, i) => {
              const isSelected = selectedAnswer === opt.text
              return (
                <button
                  key={i}
                  className={`sq-option-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedAnswer(opt.text)}
                >
                  <div className="sq-opt-letter">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span>{opt.text}</span>
                </button>
              )
            })}
          </div>
        </div>

        <footer className="sq-footer">
          <div className="btn-div">
            <button
              className="btn btn-primary sq-btn-submit"
              onClick={() => {
                handleSubmit()
              }}
              disabled={!selectedAnswer}
            >
              Submit Answer
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default StartedQuiz
