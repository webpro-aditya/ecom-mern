import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check token/localstorage, fetch user
    const token = localStorage.getItem('token')
    if(token){
      axios.get('/api/auth/me', {headers:{Authorization:`Bearer ${token}`}})
        .then(res => setUser(res.data))
        .catch(()=>setUser(null))
        .finally(()=>setLoading(false))
    }else{
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
