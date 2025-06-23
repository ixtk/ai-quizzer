import { createContext, useEffect, useState } from "react"
import { auth } from "../lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import axiosInstance from "../lib/axiosInstance"

export const AuthContext = createContext()

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async currentUser => {
      if (currentUser) {
        setUser({
          username: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
          uid: currentUser.uid
        })

        try {
          const token = await currentUser.getIdToken()
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`
        } catch (error) {
          console.error("Token setup error:", error)
        }
      } else {
        setUser(null)
        delete axiosInstance.defaults.headers.common["Authorization"]
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
