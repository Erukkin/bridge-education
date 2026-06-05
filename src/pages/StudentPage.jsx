import { useState, useEffect } from 'react'
import { getStudents } from '../api'
import { changePassword } from '../api'
import '../App.css'

export default function StudentPage({ onLogout, user }) {
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    async function loadStudent() {
      try {
        const students = await getStudents()
        const found = students.find(s => s.id === user.student_id)
        setStudent(found)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadStudent()
  }, [])

  async function handleChangePassword() {
    setError('')
    setSuccess('')
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill all fields.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.')
      return
    }
    try {
      await changePassword(user.id, oldPassword, newPassword)
      setSuccess('Password changed successfully!')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => setShowChangePassword(false), 1500)
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white', fontFamily: 'Sora', fontSize: '18px' }}>Loading...</p>
    </div>
  )

  if (!student) return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'white', fontFamily: 'Sora', fontSize: '18px' }}>Student not found.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--navy)', fontFamily: 'DM Sans' }}>

      {/* Topbar */}
      <div className="topbar">
        <p className="topbar-logo-title">Bridge Education</p>
        <div className="topbar-actions">
          <button
            onClick={() => setShowChangePassword(true)}
            style={{
              padding: '8px 14px', borderRadius: '8px',
              border: '1.5px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: 'var(--gray-light)',
              cursor: 'pointer', fontSize: '13px',
              fontFamily: 'Sora', fontWeight: 600
            }}
          >
            🔑 Change Password
          </button>
          <button
            onClick={onLogout}
            style={{
              padding: '8px 14px', borderRadius: '8px',
              border: '1.5px solid rgba(255,255,255,0.15)',
              background: 'transparent', color: 'var(--gray-light)',
              cursor: 'pointer', fontSize: '13px',
              fontFamily: 'Sora', fontWeight: 600
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '4px' }}>Welcome back,</p>
          <h1 style={{ fontFamily: 'Sora', fontWeight: 800, fontSize: '28px', color: 'var(--white)' }}>
            {student.nama_lengkap}
          </h1>
        </div>

        {/* Profile Card */}
        <div style={{
          background: 'linear-gradient(145deg, var(--navy-light), var(--blue))',
          borderRadius: '16px', padding: '24px',
          border: '1.5px solid rgba(255,255,255,0.08)',
          marginBottom: '16px'
        }}>
          <p style={{ fontSize: '11px', color: 'var(--accent-bright)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Student Profile
          </p>

          {[
            { label: 'Full Name', value: student.nama_lengkap, icon: '👤' },
            { label: 'Student ID', value: student.id, icon: '🪪' },
            { label: 'Gender', value: student.jenis_kelamin, icon: '⚥' },
            { label: 'Phone', value: student.no_telp?.replace(/(\d{4})(?=\d)/g, '$1-'), icon: '📞' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 0',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none'
            }}>
              <span style={{ fontSize: '18px', width: '24px' }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '2px' }}>{item.label}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Class Card */}
        <div style={{
          background: 'linear-gradient(145deg, var(--navy-light), var(--blue))',
          borderRadius: '16px', padding: '24px',
          border: '1.5px solid rgba(255,255,255,0.08)'
        }}>
          <p style={{ fontSize: '11px', color: 'var(--accent-bright)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
            Class Information
          </p>

          {[
            { label: 'Program', value: `${student.program} Programs`, icon: '📚' },
            { label: 'Class Type', value: student.class_type, icon: '👥' },
            { label: 'Mode', value: student.mode, icon: student.mode === 'Online' ? '💻' : '🏫' },
            { label: 'Class ID', value: student.class_id, icon: '🏷️' },
            ...(student.age_group ? [{ label: 'Age Group', value: student.age_group, icon: '🎯' }] : [])
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 0',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none'
            }}>
              <span style={{ fontSize: '18px', width: '24px' }}>{item.icon}</span>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '2px' }}>{item.label}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)' }}>{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(5,15,35,0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: 'white', borderRadius: '16px',
            width: '100%', maxWidth: '400px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            overflow: 'hidden'
          }}>
            <div className="modal-header">
              <div>
                <p className="modal-header-label">Account</p>
                <h2 className="modal-header-title">Change Password</h2>
              </div>
              <button className="modal-close-btn" onClick={() => {
                setShowChangePassword(false)
                setError('')
                setSuccess('')
              }}>✕</button>
            </div>

            <div className="modal-body">
              <label>Current Password</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="Enter current password"
              />
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <label>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />

              {error && (
                <div style={{
                  background: 'rgba(229,62,62,0.08)',
                  border: '1px solid rgba(229,62,62,0.25)',
                  borderRadius: '8px', padding: '10px 14px',
                  fontSize: '13px', color: '#E53E3E', marginBottom: '16px'
                }}>
                  ⚠️ {error}
                </div>
              )}

              {success && (
                <div style={{
                  background: 'rgba(46,125,50,0.08)',
                  border: '1px solid rgba(46,125,50,0.25)',
                  borderRadius: '8px', padding: '10px 14px',
                  fontSize: '13px', color: '#2E7D32', marginBottom: '16px'
                }}>
                  ✅ {success}
                </div>
              )}

              <div className="modal-footer">
                <button className="btn-cancel" onClick={() => {
                  setShowChangePassword(false)
                  setError('')
                  setSuccess('')
                }}>Cancel</button>
                <button className="btn-confirm" onClick={handleChangePassword}>
                  Save Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}