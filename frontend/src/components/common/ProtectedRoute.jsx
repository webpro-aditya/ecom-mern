import { useAuth } from '../../context/AuthContext'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth()
  if(loading) return <div>Loading...</div>
  if(!user) return <Navigate to="/admin-login" />
  if(!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />
  return children
}
