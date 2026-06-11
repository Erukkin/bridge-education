import { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import StudentPage from './pages/StudentPage'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('bridgeUser')
    const lastActive = localStorage.getItem('bridgeLastActive')
    const now = new Date().getTime()

    if (saved) {
      if (lastActive && (now - parseInt(lastActive) > 1 * 60 * 60 * 1000)) {
        localStorage.removeItem('bridgeUser')
        localStorage.removeItem('bridgeLastActive')
        setUser(null)
      } else {
        setUser(JSON.parse(saved))
      }
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (!user) return;

    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(triggerLogout, 1 * 60 * 60 * 1000);
      localStorage.setItem('bridgeLastActive', new Date().getTime().toString());
    };

    const triggerLogout = () => {
      alert("Session Expired");
      handleLogout();
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]);

  function handleLogin(userData) {
    setUser(userData)
    localStorage.setItem('bridgeUser', JSON.stringify(userData))
    localStorage.setItem('bridgeLastActive', new Date().getTime().toString())
  }

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('bridgeUser')
    localStorage.removeItem('bridgeLastActive')
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