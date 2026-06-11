import { useState, useEffect } from 'react'
import './App.css'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import StudentPage from './pages/StudentPage'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1. Jalankan pengecekan waktu terakhir aktif saat aplikasi pertama kali dibuka
  useEffect(() => {
    const saved = localStorage.getItem('bridgeUser')
    const lastActive = localStorage.getItem('bridgeLastActive')
    const now = new Date().getTime()

    if (saved) {
      // Jika ada catatan waktu terakhir aktif, cek apakah durasi matinya sudah lewat 2 jam
      // (2 jam * 60 menit * 60 detik * 1000 ms = 7200000 ms)
      if (lastActive && (now - parseInt(lastActive) > 2 * 60 * 60 * 1000)) {
        // Jika sudah ditinggal lebih dari 2 jam, hapus data dan paksa relogin
        localStorage.removeItem('bridgeUser')
        localStorage.removeItem('bridgeLastActive')
        setUser(null)
      } else {
        // Jika masih kurang dari 2 jam, ijinkan langsung masuk dashboard
        setUser(JSON.parse(saved))
      }
    }
    setLoading(false)
  }, [])

  // 2. FITUR AUTO LOGOUT SEWAKTU NO ACTIVITY (TAB TERBUKA)
  useEffect(() => {
    if (!user) return;

    let timer;

    const resetTimer = () => {
      if (timer) clearTimeout(timer);
      
      // Setel timer auto-logout 2 jam
      timer = setTimeout(triggerLogout, 2 * 60 * 60 * 1000);

      // Setiap kali ada aktivitas, perbarui juga catatan waktu di localStorage
      // Ini yang menjaga agar saat tab tiba-tiba ditutup, browser tahu menit terakhir kamu aktif
      localStorage.setItem('bridgeLastActive', new Date().getTime().toString());
    };

    const triggerLogout = () => {
      alert("Sesi Anda telah berakhir karena tidak ada aktivitas selama 2 jam.");
      handleLogout();
    };

    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];

    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    // Jalankan tracker waktu pertama kali
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
    // Catat waktu awal saat login berhasil
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