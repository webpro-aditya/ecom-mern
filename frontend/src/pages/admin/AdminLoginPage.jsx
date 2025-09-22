// src/pages/admin/AdminLoginPage.jsx
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await axios.post('/api/auth/login', { email, password })
      // Assuming data = { token, user: { role: ... }, ... }
      if(['admin','vendor'].includes(data.user.role)){
        localStorage.setItem('token', data.token)
        // Store user info, set context, etc.
        navigate('/admin-dashboard') // or dynamic dashboard based on role
      }else{
        setError('This page is only for Admin/Vendor.')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <form
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold mb-4">Admin/Vendor Login</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <input
          className="input mb-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={e=>setEmail(e.target.value)}
          required
        />
        <input
          className="input mb-4"
          placeholder="Password"
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          required
        />
        <button
          className="btn btn-primary w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  )
}

export default AdminLoginPage
