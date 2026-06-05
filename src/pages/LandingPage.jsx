import { useState } from 'react'
import '../App.css'

// ── DATA ──────────────────────────────────────────────
const features = [
  {
    icon: '👨‍🏫',
    title: 'Experienced Tutors',
    desc: 'Learn from certified and professional English instructors who are dedicated to helping you succeed.'
  },
  {
    icon: '⏰',
    title: 'Flexible Timing',
    desc: 'Choose a learning schedule that fits your busy routine. Morning, afternoon, evening, and night sessions are available.'
  },
  {
    icon: '📚',
    title: 'Up-to-Date Curriculum',
    desc: 'We provide a modern, interactive, and comprehensive syllabus that adapts to your learning goals and pace.'
  },
  {
    icon: '📊',
    title: 'Monitor Progress',
    desc: 'Easily monitor your learning journey and view detailed performance reports in real-time through our application.'
  }
]

const programs = [
  {
    level: <>General<br />English</>,
    subtitle: 'Young Learners, Teens & Adults',
    price: 'Rp 250.000',
    period: '/ bulan',
    color: '#1A4A8A',
    popular: true,
    features: [
      '8x pertemuan / bulan',
      'TOEFL',
      'Try Out bulanan',
      'Laporan perkembangan',
      'Simulasi ujian mingguan',
      'Mentoring karir & jurusan',
    ]
  },
  {
    level: 'Academic English',
    subtitle: 'Kelas 1 – 6',
    price: 'Rp 250.000',
    period: '/ bulan',
    color: '#1A4A8A',
    features: [
      '8x pertemuan / bulan',
      'TOEFL',
      'Try Out bulanan',
      'Laporan perkembangan',
      'Simulasi ujian mingguan',
      'Mentoring karir & jurusan',
    ]
  },
  {
    level: 'Foundation & ESP',
    subtitle: 'Kelas 1 – 6',
    price: 'Rp 250.000',
    period: '/ bulan',
    color: '#1A4A8A',
    features: [
      '8x pertemuan / bulan',
      'TOEFL',
      'Try Out bulanan',
      'Laporan perkembangan',
      'Simulasi ujian mingguan',
      'Mentoring karir & jurusan',
    ]
  },
  {
    level: <>IELTS &<br />TOEFL</>,
    subtitle: 'Kelas 7 – 9',
    price: 'Rp 350.000',
    period: '/ bulan',
    color: '#1A4A8A',
    popular: true,
    features: [
      '10x pertemuan / bulan',
      'Persiapan TOEFL',
      'Try Out mingguan',
      'Simulasi ujian mingguan',
      'Mentoring karir & jurusan',
      'Akses video belajar 24/7'
    ]
  },
  {
    level: <>U-Prep &<br />U-Assist</>,
    subtitle: 'Kelas 10 – 12',
    price: 'Rp 450.000',
    period: '/ bulan',
    color: '#1A4A8A',
    features: [
      '12x pertemuan / bulan',
      'Semua mata pelajaran',
      'IELTS Preparation',
      'Simulasi ujian mingguan',
      'Mentoring karir & jurusan',
      'Akses video belajar 24/7'
    ]
  }
]

const testimonials = [
  { name: 'Elia', role: 'Orang Tua', avatar: '👩', rating: 5, text: 'dadada' },
  { name: 'Elia', role: 'Siswa SMP Kelas 9', avatar: '👦', rating: 5, text: 'dadada' },
  { name: 'Elia', role: 'Orang tua murid SMA', avatar: '👨', rating: 5, text: 'dadada' },
  { name: 'Elia', role: 'Siswa SMA Kelas 12', avatar: '👧', rating: 5, text: 'dadada' },
  { name: 'Elia', role: 'Orang tua murid SMP', avatar: '👩‍🦱', rating: 5, text: 'dadada' },
  { name: 'Elia', role: 'Siswa SD Kelas 6', avatar: '🧒', rating: 5, text: 'dadada' }
]

// ── LOGIN MODAL ────────────────────────────────────────
function LoginModal({ onClose, onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleLogin() {
    if (!username || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onLogin()
      } else {
        setError('Invalid username or password.')
        setLoading(false)
      }
    }, 600)
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(5,15,35,0.65)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px'
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'white',
        borderRadius: '20px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        animation: 'modalIn 0.25s ease'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0B1E3E, #1A4A8A)',
          padding: '28px 28px 24px',
          position: 'relative'
        }}>
          <button onClick={onClose} style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            color: 'white', width: '32px', height: '32px',
            borderRadius: '50%', cursor: 'pointer', fontSize: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>✕</button>
          <h2 style={{
            fontFamily: 'Sora, sans-serif', fontWeight: 800,
            fontSize: '20px', color: 'white', marginBottom: '4px'
          }}>
            Welcome back
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: '28px' }}>
          <label>Username</label>
          <input
            value={username}
            onChange={e => { setUsername(e.target.value); setError('') }}
            placeholder="Enter username"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            autoFocus
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="Enter password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />

          {error && (
            <div style={{
              background: 'rgba(229,62,62,0.08)',
              border: '1px solid rgba(229,62,62,0.25)',
              borderRadius: '8px', padding: '10px 14px',
              fontSize: '13px', color: '#E53E3E',
              marginBottom: '16px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(74,144,217,0.5)'
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(74,144,217,0.4)'
            }}
            style={{
              width: '100%', padding: '13px',
              borderRadius: '10px', border: 'none',
              background: loading
                ? 'rgba(74,144,217,0.6)'
                : 'linear-gradient(135deg, #4A90D9, #5BA3F5)',
              color: 'white', cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: '15px',
              fontFamily: 'Sora, sans-serif',
              boxShadow: '0 4px 14px rgba(74,144,217,0.4)',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <p style={{
            textAlign: 'center', marginTop: '16px',
            color: '#8FA3BF', fontSize: '12px'
          }}>
            Demo: <b style={{ color: '#4A5568' }}>admin</b> / <b style={{ color: '#4A5568' }}>admin123</b>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── COMPONENTS ────────────────────────────────────────
function Navbar({ onOpenLogin }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="lp-navbar">
      <div className="lp-navbar-inner">
        <div className="lp-nav-cta">
          <button className="lp-btn-solid" onClick={onOpenLogin}>Login</button>
        </div>
        <button className="lp-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>
    </nav>
  )
}

function Hero({ onOpenLogin }) {
  return (
    <section className="lp-hero">
      <div className="lp-hero-inner">
        <div className="lp-hero-content">
          <h1 className="lp-hero-title">Bridge Education</h1>
          <p className="lp-hero-sub">
            English learning program, experienced tutors, and a flexible schedule tailored to your needs.
          </p>
          <div className="lp-hero-actions">
            <button className="lp-btn-solid lp-btn-lg" onClick={onOpenLogin}>
              Start Learning Now →
            </button>
          </div>
          <div className="lp-hero-stats">
            <div className="lp-stat">
              <span className="lp-stat-num">2.500+</span>
              <span className="lp-stat-label">Active Students</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat-num">98%</span>
              <span className="lp-stat-label">Satisfaction Rate</span>
            </div>
            <div className="lp-stat-divider" />
            <div className="lp-stat">
              <span className="lp-stat-num">150+</span>
              <span className="lp-stat-label">Active Tutors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  return (
    <section className="lp-section" id="features">
      <div className="lp-section-inner">
        <div className="lp-section-header">
          <span className="lp-section-badge">Why Us?</span>
          <h2 className="lp-section-title">Bridge Education Expertise</h2>
          <p className="lp-section-sub">We are committed to providing the best learning experience for every student.</p>
        </div>
        <div className="lp-features-grid">
          {features.map((f, i) => (
            <div className="lp-feature-card" key={i}>
              <div className="lp-feature-icon">{f.icon}</div>
              <h3 className="lp-feature-title">{f.title}</h3>
              <p className="lp-feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Programs({ onOpenLogin }) {
  const duplicatedPrograms = [...programs, ...programs]

  return (
    <section className="lp-section lp-section-dark" id="programs">
      <div className="lp-section-inner">
        <div className="lp-section-header">
          <span className="lp-section-badge lp-section-badge-light">Our Programs</span>
          <h2 className="lp-section-title lp-title-light">Choose the Right Program For You</h2>
          <p className="lp-section-sub lp-sub-light">Complete packages for every educational level at affordable prices</p>
        </div>

        <div className="lp-programs-autoplay-container">
          <div className="lp-programs-grid-track">
            {duplicatedPrograms.map((p, i) => (
              <div className={`lp-program-card ${p.popular ? 'lp-program-popular' : ''}`} key={i}>
                {p.popular && <div className="lp-popular-badge">⭐ Most Popular</div>}
                <div className="lp-program-header" style={{ background: p.color }}>
                  <h3 className="lp-program-level">{p.level}</h3>
                  <p className="lp-program-subtitle">{p.subtitle}</p>
                  <div className="lp-program-price">
                    <span className="lp-price-num">{p.price}</span>
                    <span className="lp-price-period">{p.period}</span>
                  </div>
                </div>
                <div className="lp-program-body">
                  <ul className="lp-program-features">
                    {p.features.map((f, j) => (
                      <li key={j}><span className="lp-check">✓</span> {f}</li>
                    ))}
                  </ul>
                  <button className="lp-btn-solid lp-btn-full" onClick={onOpenLogin}>
                    Daftar Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="lp-section" id="testimonials">
      <div className="lp-section-inner">
        <div className="lp-section-header">
          <span className="lp-section-badge">Testimoni</span>
          <h2 className="lp-section-title">Kata Mereka tentang Kami</h2>
          <p className="lp-section-sub">Ribuan siswa dan orang tua telah mempercayakan pendidikan mereka kepada kami</p>
        </div>
        <div className="lp-testimonials-grid">
          {testimonials.map((t, i) => (
            <div className="lp-testimonial-card" key={i}>
              <div className="lp-testimonial-rating">{'⭐'.repeat(t.rating)}</div>
              <p className="lp-testimonial-text">"{t.text}"</p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar">{t.avatar}</div>
                <div>
                  <p className="lp-testimonial-name">{t.name}</p>
                  <p className="lp-testimonial-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="lp-footer" id="contact">
      <div className="lp-footer-inner">
        <div className="lp-footer-brand">
          <div className="lp-logo" style={{ marginBottom: '12px' }}>
            <span className="lp-logo-icon">🎓</span>
            <span className="lp-logo-text" style={{ color: 'white' }}>Bridge Education</span>
          </div>
          <div className="lp-socials">
            <a href="#" className="lp-social-btn">📘 Facebook</a>
            <a href="#" className="lp-social-btn">📸 Instagram</a>
            <a href="#" className="lp-social-btn">▶️ YouTube</a>
          </div>
        </div>
        <div className="lp-footer-links">
          <h4>Perusahaan</h4>
          <a href="#">Tentang Kami</a>
          <a href="#">Karir</a>
          <a href="#">Blog</a>
          <a href="#">Kebijakan Privasi</a>
        </div>
        <div className="lp-footer-links">
          <h4>Kontak</h4>
          <a href="#">📞 0812-3456-7890</a>
          <a href="#">✉️ bridge@bridge.id</a>
          <a href="#">📍 Manado, Indonesia</a>
          <a href="#">💬 Live Chat</a>
        </div>
      </div>
      <div className="lp-footer-bottom">
        <p>© 2024 Bridge Education. All rights reserved.</p>
      </div>
    </footer>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────
export default function LandingPage({ onLogin }) {
  const [showLogin, setShowLogin] = useState(false)

  return (
    <div className="lp-root">
      <Navbar onOpenLogin={() => setShowLogin(true)} />
      <Hero onOpenLogin={() => setShowLogin(true)} />
      <Features />
      <Programs onOpenLogin={() => setShowLogin(true)} />
      <Testimonials />
      <Footer />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={() => { setShowLogin(false); onLogin() }}
        />
      )}
    </div>
  )
}