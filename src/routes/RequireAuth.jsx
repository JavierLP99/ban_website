import { useAuth } from 'react-oidc-context'
import { Navigate, useLocation } from 'react-router-dom'

const RequireAuth = ({ children }) => {
  const auth = useAuth()
  const location = useLocation()

  if (auth.isLoading) {
    return <div>Loading...</div>
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default RequireAuth
