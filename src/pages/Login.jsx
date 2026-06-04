import { useState } from 'react'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleLogin() {
    // Sementara pakai kredensial hardcoded dulu
    // Nanti bisa diganti dengan fetch ke backend
    if (username === 'admin' && password === 'admin123') {
      onLogin()
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'var(--navy)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'DM Sans, sans-serif'
    }}>
      <div style={{
        background: 'var(--navy-light)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>

          <h1 style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 800, fontSize: '29px',
            color: 'var(--white)', marginBottom: '6px'
          }}>Bridge Education</h1>
          <p style={{ color: 'var(--gray)', fontSize: '13px' }}>
            Sign in to your account
          </p>
        </div>

        {/* Form */}
        <div style={{ marginBottom: '16px' }}>
          <label>Username</label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter username"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {/* Error message */}
        {error && (
          <p style={{
            color: '#FC8181',
            fontSize: '13px',
            marginBottom: '16px',
            background: 'rgba(229,62,62,0.1)',
            border: '1px solid rgba(229,62,62,0.3)',
            borderRadius: '8px',
            padding: '10px 14px'
          }}>
            ⚠️ {error}
          </p>
        )}

        {/* Button */}
        <button
            onClick={handleLogin}
            onMouseEnter={e => {
                e.currentTarget.style.opacity = '0.85'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(74,144,217,0.5)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(74,144,217,0.4)'
            }}
            style={{
                width: '100%', padding: '13px',
                borderRadius: '10px', border: 'none',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-bright))',
                color: 'var(--white)', cursor: 'pointer',
                fontWeight: 700, fontSize: '15px',
                fontFamily: 'Sora, sans-serif',
                boxShadow: '0 4px 14px rgba(74,144,217,0.4)',
                transition: 'all 0.2s ease'
            }}
            >
        Sign In
        </button>
        

        {/* Hint */}
        <p style={{
          textAlign: 'center', marginTop: '20px',
          color: 'var(--gray)', fontSize: '12px'
        }}>
          username <b style={{ color: 'var(--gray-light)' }}>admin</b> / password <b style={{ color: 'var(--gray-light)' }}>admin123</b>
        </p>
      </div>
    </div>
  )
}