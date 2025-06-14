import "./Layout.css"
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
  const [userInfo, setUserInfo] = useState(null)

  const handleLogin = async provider => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      setIsLoggedIn(true)
      setUserInfo({
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        uid: user.uid
      })

      try {
        const token = await user.getIdToken()
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${token}`
        await axiosInstance.post("/users", { firebaseId: user.uid })
      } catch (error) {
        console.error("Token retrieval or user registration error:", error)
      }
    } catch (error) {
      console.error(`${provider.providerId} login error:`, error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      setIsLoggedIn(false)
      setUserInfo(null)
      delete axiosInstance.defaults.headers.common["Authorization"]
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        setIsLoggedIn(true)
        setUserInfo({
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          uid: user.uid
        })

        try {
          const token = await user.getIdToken()
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`
        } catch (error) {
          console.error("Token retrieval error:", error)
        }
      } else {
        setIsLoggedIn(false)
        setUserInfo(null)
        delete axiosInstance.defaults.headers.common["Authorization"]
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <>
      <header className="header-section container">
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
              {userInfo?.photoURL && (
                <img
                  src={userInfo.photoURL}
                  alt="User avatar"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              )}
              <span className="profile-txt">
                {userInfo?.displayName || "Profile"}
              </span>
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
