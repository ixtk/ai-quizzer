import { Navigate, Outlet } from "react-router"
import { useAuth } from "../lib/AuthContext"

function ProtectedRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>Loading...</div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
