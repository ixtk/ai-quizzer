import React, { useState } from "react"
import "../../App.css"
import "./HomePage.css"
import { LogOut, Grid, Users, Award } from "lucide-react"


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
                Google
              </button>
              <button
                className="btn btn-secondary fb-btn"
                onClick={handleLogin}
              >
                Facebook
              </button>
            </>
          )}
        </div>
      </header>

      <main className="main-content">
        <div className="page-header">
          <h1 className="main-title">Can Your Friends Spot the Truth?</h1>
          <p className="subtitle">
            Create topic-based grids of facts and lies, then watch them guess
            what's real.
          </p>

          {isLoggedIn && (
            <div className="actions">
              <button className="btn btn-primary host-game-btn">
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
                  <Award size={32} color="white"  />
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
