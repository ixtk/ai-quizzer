import React, { useState } from "react"
import { useNavigate, Link } from "react-router"
import { Save, RefreshCcw, Trash2, ArrowLeft } from "lucide-react"
import { getAuth } from "firebase/auth"
import axiosInstance from "../../lib/axiosInstance"
import "../../App.css"
import "./GenerateQuiz.css"

function GenerateQuiz() {
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState("Easy")
  const [questions, setQuestions] = useState([])
  const navigate = useNavigate()

  const handleDelete = id => {
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const generateQuiz = async () => {
    try {
      const res = await axiosInstance.post("/generate-quiz", {
        topic,
        difficulty,
        numberOfQuestions: 5
      })

      const data = res.data
      if (Array.isArray(data)) {
        const withIds = data.map((q, i) => ({ id: i + 1, ...q }))
        setQuestions(withIds)
      } else {
        alert("Quiz format error.")
      }
    } catch (err) {
      console.error("Quiz gen error:", err)
      alert("Failed to generate quiz.")
    }
  }

  const saveQuiz = async () => {
    try {
      const auth = getAuth()
      const user = auth.currentUser
      if (!user) return alert("You must be logged in to save quizzes")

      const res = await axiosInstance.post("/save-quiz", {
        title: topic || "Untitled Quiz",
        questions
      })

      if (res.status === 200) {
        alert("Quiz saved!")
        navigate("/profile")
      } else {
        alert("Save failed")
      }
    } catch (err) {
      console.error("Save error:", err)
      alert("Error saving quiz")
    }
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">
        <ArrowLeft size={24} /> Back to Quizzer
      </Link>

      <div className="card create-quiz-form">
        <h2>Create a Quiz</h2>
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
                value={level}
                checked={difficulty === level}
                onChange={() => setDifficulty(level)}
              />
              {level}
            </label>
          ))}
        </div>
        <button className="btn btn-primary generate-btn" onClick={generateQuiz}>
          Generate Quiz
        </button>
      </div>

      <div className="card">
        <div className="quiz-header">
          <h3>Generated Quiz</h3>
          <div className="quiz-header-right">
            <button className="topic-btn">{topic || "Untitled"}</button>
            <button className="btn btn-primary save-btn" onClick={saveQuiz}>
              <Save size={19} /> Save Quiz
            </button>
          </div>
        </div>

        {questions.map(q => (
          <div key={q.id} className="card quiz-question">
            <div className="q-card-title">
              <p>
                <strong>Q{q.id}:</strong> {q.text}
              </p>
              <div className="icon-buttons">
                <button className="btn icon-btn">
                  <RefreshCcw size={19} />
                </button>
                <button
                  className="btn icon-btn"
                  onClick={() => handleDelete(q.id)}
                >
                  <Trash2 size={19} />
                </button>
              </div>
            </div>
            <div className="option-div">
              {q.options.map((opt, i) => (
                <button key={i} className="opt-btn">
                  <div className="opt-letter">
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt.text}
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
