import React, { useEffect, useState } from "react"
import { Clock } from "lucide-react"
import "../../../App.css"
import "./StartedQuiz.css"
import { socket } from "../../../lib/socket"

function StartedQuiz({ roomCode, selectedQuiz }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [question, setQuestion] = useState(null)

  const questions = selectedQuiz?.questions || []
  const total = questions.length
  const q = questions[currentQuestionIndex]
  const progressPercent = ((currentQuestionIndex + 1) / total) * 100

  useEffect(() => {
    const handleAnswerSelected = ({ answers }) => {
      console.log("[✅] Answer confirmed by backend:", answers)

      setCurrentQuestionIndex(index => {
        const next = index + 1
        if (next < questions.length) {
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
  }, [questions.length])

  useEffect(() => {
    const handleQuestion = ({ index, question }) => {
      setCurrentQuestionIndex(index)
      setQuestion(question) // You'll need to manage a separate state for current question
    }

    socket.on("question", handleQuestion)
    return () => socket.off("question", handleQuestion)
  }, [])

  const handleSubmit = () => {
    if (!selectedAnswer) return

    socket.emit("select-answer", {
      selected: selectedAnswer,
      roomCode
    })
  }

  if (!selectedQuiz || !q) {
    return (
      <div className="container">
        <p>Loading quiz questions...</p>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <header className="sq-header">
          <div>
            <h1 className="sq-title">{selectedQuiz.title}</h1>
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
              const isSelected = selectedAnswer === opt
              return (
                <button
                  key={i}
                  className={`sq-option-btn ${isSelected ? "selected" : ""}`}
                  onClick={() => setSelectedAnswer(opt)}
                >
                  <div className="sq-opt-letter">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span>{opt}</span>
                </button>
              )
            })}
          </div>
        </div>

        <footer className="sq-footer">
          <div className="btn-div">
            <button
              className="btn btn-primary sq-btn-submit"
              onClick={handleSubmit}
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
