import { useEffect, useState } from "react"
import { Outlet } from "react-router"
import { Brain, LogOut } from "lucide-react"
import { auth } from "../lib/firebase"
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "firebase/auth"
import axiosInstance from "../lib/axiosInstance"

const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

function Layout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = async provider => {
    try {
      const result = await signInWithPopup(auth, provider)
      console.log(`${provider.providerId} user:`, result.user)
      setIsLoggedIn(true)
    } catch (error) {
      console.error(`${provider.providerId} login error:`, error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsLoggedIn(false)
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setIsLoggedIn(true)
        const token = await user.getIdToken()
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`
        await axiosInstance.post("/users", { firebaseId: user.uid })
      } else {
        setIsLoggedIn(false)
        delete axiosInstance.defaults.headers.common["Authorization"]
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      <header className="header-section">
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
          <div className="icon-wrapper wrapper-small">
            <Brain size={28} color="white" />
          </div>
          <p
            style={{
              color: "var(--purple-700)",
              fontSize: "1.2rem",
              fontWeight: "500"
            }}
          >
            AI Multiplayer Quizzer
          </p>
        </div>
        <div className="header-actions">
          {isLoggedIn ? (
            <>
              <span className="profile-txt">Profile</span>
              <div className="logout-div" onClick={handleLogout}>
                Logout <LogOut className="logout-icon" size={24} />
              </div>
            </>
          ) : (
            <>
              <button
                className="btn btn-secondary google-btn"
                onClick={() => handleLogin(googleProvider)}
              >
                <img
                  src="/google-logo.webp"
                  alt="Google"
                  className="auth-icon"
                />
                Google
              </button>

              <button
                className="btn btn-secondary fb-btn"
                onClick={() => handleLogin(facebookProvider)}
              >
                <img
                  src="/facebook-logo.png"
                  alt="Facebook"
                  className="auth-icon"
                />
                Facebook
              </button>
            </>
          )}
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout
