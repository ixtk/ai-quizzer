import React, { useState } from "react"
import { Link } from "react-router"
import { Save, RefreshCcw, Trash2, ArrowLeft } from "lucide-react"
import "../../App.css"
import './GenerateQuiz.css'
import questionsData from "../mock-data/questions.json"

function GenerateQuiz() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Easy")
  const [questions, setQuestions] = useState(questionsData)

  const handleDelete = id => {
    const updatedQuestions = questions.filter(q => q.id !== id)
    setQuestions(updatedQuestions)
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        <ArrowLeft size={24} strokeWidth={2} /> Back to Quizzer
      </Link>

      <div className="card create-quiz-form">
        <h2 style={{ fontSize: "1.5rem" }}>Create a Quiz</h2>
        <label className="input-label">Topic / Prompt</label>
        <input
          type="text"
          placeholder="Enter topic"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
        <p className="difficulty-label">Difficulty</p>
        <div className="difficulty-options">
          {["Easy", "Medium", "Hard"].map(level => (
            <label key={level} className="radio-label">
              <input
                type="radio"
                name="difficulty"
                value={level}
                checked={difficulty === level}
                onChange={() => setDifficulty(level)}
              />
              {level}
            </label>
          ))}
        </div>
        <button className="btn btn-primary generate-btn">Generate Quiz</button>
      </div>

      <div className="card">
        <div className="quiz-header">
          <h3 style={{ fontSize: "1.5rem" }}>Generated Quiz</h3>
          <div className="quiz-header-right">
            <button className="topic-btn">The Birthday Plan</button>
            <button className="btn btn-primary save-btn">
              <Save size={19} className="icon" />
              Save Quiz
            </button>
          </div>
        </div>

        {questions.map(q => (
          <div className="card quiz-question">
            <div className="q-card-title">
              <div className="icon-buttons">
                <button className="btn btn-secondary icon-btn">
                  <RefreshCcw size={19} />
                </button>
                <button
                  className="btn btn-secondary icon-btn"
                  onClick={() => handleDelete(q.id)}
                >
                  <Trash2 size={19} />
                </button>
              </div>

              <p className="question-text">
                <strong>Question {q.id}:</strong> {q.text}
              </p>
            </div>
            <div className="option-div">
              {q.options.map((opt, index) => (
                <button key={index} className="opt-btn">
                  <div className="opt-letter">
                    {String.fromCharCode(65 + index)}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GenerateQuiz
