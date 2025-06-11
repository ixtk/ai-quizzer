import "../../App.css"
import "./HomePage.css"
import { Users, Zap, Brain, Clock, Plus } from "lucide-react"

const HomePage = () => {
  const isLoggedIn = true

  return (
    <div className="container">
      <main className="main-content">
        <div className="page-header">
          <span className="top-btn">
            <Zap />
            Powered by Gemini AI
          </span>
          <h1 className="main-title">Create & Play </h1>
          <span className="main-title-black">AI-Generated Quizzes </span>
          <p className="subtitle">
            Generate custom multiple-choice quizzes on any topic with Al, then
            compete with friends in real-time. Test your knowledge, race against
            the clock, and climb the leaderboard!
          </p>

          {isLoggedIn && (
            <div className="actions">
              <button className="btn btn-primary host-game-btn">
                <Plus size={35} color="white" className="plus-icon" />
                Host a Game
              </button>

              <div className="join-game">
                <input
                  type="text"
                  className="room-input"
                  placeholder="Enter room code"
                />
                <button className="btn btn-outline join-btn">Join</button>
              </div>
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <span className="lower-title">How It Works</span>
            <p className="subtitle2">
              Create, host, and play multiplayer quizzes in minutes with the
              power of AI
            </p>
          </div>
        </div>

        <div className="cards">
          {isLoggedIn ? (
            <>
              <div className="card">
                <div className="icon-wrapper">
                  <Brain size={32} color="white" />
                </div>
                <h3 className="card-title">Generate Quiz</h3>
                <p className="card-desc">
                  Enter any topic and select a difficulty level. Gemini Al
                  instantly creates 5-10 multiple-choice questions with 4 answer
                  options each.
                </p>
              </div>

              <div className="card">
                <div className="icon-wrapper wrapper2">
                  <Users size={32} color="white" />
                </div>
                <h3 className="card-title">Host a Game</h3>
                <p className="card-desc">
                  Share your 6-digit game code with friends. They'll join your
                  lobby where you can see everyone's status before starting the
                  quiz.
                </p>
              </div>

              <div className="card">
                <div className="icon-wrapper wrapper3">
                  <Clock size={32} color="white" />
                </div>
                <h3 className="card-title">Play & Compete</h3>
                <p className="card-desc">
                  Race against a 15-second timer for each question. Score points
                  for correct answers and see who tops the leaderboard when the
                  quiz ends.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="card">
                <div className="icon-wrapper">
                  <Brain size={32} color="white" />
                </div>
                <div className="step-number">1</div>
                <h3 className="card-title">Generate Quiz</h3>
                <p className="card-desc">
                  Enter any topic and select a difficulty level. Gemini Al
                  instantly creates 5-10 multiple-choice questions with 4 answer
                  options each
                </p>
              </div>

              <div className="card">
                <div className="icon-wrapper wrapper2">
                  <Users size={32} color="white" />
                </div>
                <div className="step-number number2">2</div>
                <h3 className="card-title">Host a Game</h3>
                <p className="card-desc">
                  Share your 6-digit game code with friends. They'll join your
                  lobby where you can see everyone's status before starting the
                  quiz.
                </p>
              </div>

              <div className="card">
                <div className="icon-wrapper wrapper3">
                  <Clock size={32} color="white" />
                </div>
                <div className="step-number number3">3</div>
                <h3 className="card-title">Play & Compete</h3>
                <p className="card-desc">
                  Race against a 15-second timer for each question. Score points
                  for correct answers and see who tops the leaderboard when the
                  quiz ends.
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default HomePage
