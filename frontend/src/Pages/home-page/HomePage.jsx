import React, { useState } from "react"
import "../../App.css"
import "./HomePage.css"
import {LogOut, Grid, Users, Award, Sparkles} from "lucide-react"


const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="container">
      <header className="header-section">
        <div className="header-actions">
          {isLoggedIn ? (
            <LogOut className="logout-icon" size={24} onClick={handleLogout} />
          ) : (
            <>
              <button
                className="btn btn-secondary google-btn"
                onClick={handleLogin}
              >
                <img
                  src="/google-logo.webp" alt="Google" className="auth-icon"/>
                Google
              </button>

              <button
                className="btn btn-secondary fb-btn"
                onClick={handleLogin}
              >
                <img
                  src="/facebook-logo.png" alt="Facebook" className="auth-icon"/>
                Facebook
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="page-header">
          <span className="top-btn">
            <Sparkles />
            The Ultimate Friend Quizz Game
          </span>
          <h1 className="main-title">Can Your Friends Spot the Truth?</h1>
          <p className="subtitle">
            Create topic-based grids of facts and lies, then watch them guess
            what's real.
          </p>

          {isLoggedIn && (
            <div className="actions">
              <button className="btn btn-primary host-game-btn">
                <Users size={30} color="white" className="users-icon" />
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
          <p className="subtitle2">
            Three simple steps to help you discover how well your friends really
            know you
          </p>
        </div>

        <div className="cards">
          {isLoggedIn ? (
            <>
              <div className="card">
                <div className="icon-wrapper">
                  <Grid size={32} color="white" />
                </div>
                <h3 className="card-title">Create Topic-Based Grids</h3>
                <p className="card-desc">
                  Craft 9 statements about yourself on different topics – 8
                  clever lies and 1 surprising truth. Make them believable to
                  keep your friends guessing!
                </p>
              </div>

              <div className="card">
                <div className="icon-wrapper wrapper2">
                  <Users size={32} color="white" />
                </div>
                <h3 className="card-title">Invite Friends</h3>
                <p className="card-desc">
                  Share your game code and watch as friends join your lobby. The
                  more players, the more fun and surprising the results!
                </p>
              </div>

              <div className="card">
                <div className="icon-wrapper">
                  <Award size={32} color="white" />
                </div>
                <h3 className="card-title">Play & Score</h3>
                <p className="card-desc">
                  Guess the truth in each friend’s grid and earn points. Fool
                  others with your lies to score even more!
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="card">
                <div className="icon-wrapper">
                  <Grid size={32} color="white" />
                </div>
                <div className="step-number">1</div>
                <h3 className="card-title">Create Topic-Based Grids</h3>
                <p className="card-desc">
                  Craft 9 statements about yourself on different topics – 8
                  clever lies and 1 surprising truth. Make them believable to
                  keep your friends guessing!
                </p>
              </div>

              <div className="card">
                <div className="icon-wrapper wrapper2">
                  <Users size={32} color="white" />
                </div>
                <div className="step-number number2">2</div>
                <h3 className="card-title">Invite Friends</h3>
                <p className="card-desc">
                  Share your game code and watch as friends join your lobby. The
                  more players, the more fun and surprising the results!
                </p>
              </div>

              <div className="card">
                <div className="icon-wrapper">
                  <Award size={32} color="white" />
                </div>
                <div className="step-number">3</div>
                <h3 className="card-title">Play & Score</h3>
                <p className="card-desc">
                  Guess the truth in each friend’s grid and earn points. Fool
                  others with your lies to score even more!
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
