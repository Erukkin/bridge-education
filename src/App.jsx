import { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import StudentPage from './pages/StudentPage'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user dari localStorage waktu app dibuka
  useEffect(() => {
    const saved = localStorage.getItem('bridgeUser')
    if (saved) {
      setUser(JSON.parse(saved))
    }
    setLoading(false)
  }, [])

  function handleLogin(userData) {
    setUser(userData)
    localStorage.setItem('bridgeUser', JSON.stringify(userData))
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('bridgeUser')
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0B1E3E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white', fontFamily: 'Sora', fontSize: '18px' }}>Loading...</p>
    </div>
  )

  if (!user) return <LandingPage onLogin={handleLogin} />
  if (user.role === 'admin') return <Dashboard onLogout={handleLogout} user={user} />
  if (user.role === 'student') return <StudentPage onLogout={handleLogout} user={user} />
}