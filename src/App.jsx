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

  // === FITUR AUTO LOGOUT 2 JAM SEWAKTU NO ACTIVITY ===
  useEffect(() => {
    // Fitur hanya berjalan kalau ada user yang sedang login
    if (!user) return;

    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      // Setel waktu 2 jam (2 jam * 60 menit * 60 detik * 1000 milidetik)
      timer = setTimeout(triggerLogout, 10 * 1000);
    };

    const triggerLogout = () => {
      alert("Session Expired");
      handleLogout(); // Panggil fungsi logout bawaan kamu
    };

    // Daftar aktivitas browser yang dideteksi (klik, ketik, mouse gerak, scroll)
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    // Pasang pendengar aktivitas ke browser
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Jalankan timer pertama kali saat user terdeteksi login
    resetTimer();

    // Bersihkan event listeners ketika user logout / komponen di-unmount
    return () => {
      if (timer) clearTimeout(timer);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user]); // Akan nge-trigger ulang setiap kali status 'user' berubah
  // ===================================================

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