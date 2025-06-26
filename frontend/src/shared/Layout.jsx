import "./Layout.css"
import { Outlet } from "react-router"
import { Brain, LogOut } from "lucide-react"
import { auth } from "../lib/firebase"
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut
} from "firebase/auth"
import axiosInstance from "../lib/axiosInstance"
import { useContext } from "react"
import { AuthContext } from "../lib/AuthContext"

const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()

function Layout() {
  const { user, setUser } = useContext(AuthContext)
  const isLoggedIn = Boolean(user)

  const handleLogin = async provider => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      setUser({
        username: user.displayName,
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
      setUser(null)
      delete axiosInstance.defaults.headers.common["Authorization"]
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

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
              <div className="header-div">
                <div style={{ display: "flex" }}>
                  {user?.photoURL && (
                    <img
                      src={user.photoURL}
                      alt="User avatar"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        objectFit: "cover",
                        marginRight: "1rem"
                      }}
                    />
                  )}

                  <span className="profile-txt">
                    {user?.displayName || "Profile"}
                  </span>
                </div>
                <div className="logout-div" onClick={handleLogout}>
                  Logout <LogOut className="logout-icon" size={24} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="header-div">
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
                {/* btn btn-secondary fb-btn */}
              </div>
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
