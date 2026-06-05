import { useState } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import StudentPage from './pages/StudentPage'

export default function App() {
  const [user, setUser] = useState(null)
  // user = { role, access_token, student_id } | null

  function handleLogin(userData) {
    setUser(userData)
  }

  function handleLogout() {
    setUser(null)
  }

  if (!user) return <LandingPage onLogin={handleLogin} />
  if (user.role === 'admin') return <Dashboard onLogout={handleLogout} user={user} />
  if (user.role === 'student') return <StudentPage onLogout={handleLogout} user={user} />
}