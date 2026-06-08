import { useState, useEffect } from 'react'
import '../App.css'
import {
  getStudents, createStudent, updateStudent, deleteStudent,
  getClasses, createClass, updateClass, deleteClass,
  createStudentUser, getStudentUser, getAdmins,
  registerAdmin, deleteUser, changeAdminPassword
} from '../api'

// ── CONSTANTS ──────────────────────────────────────────
const PROGRAMS = ['GE', 'AE', 'Foundation', 'IELTS', 'U-Prep']

const CLASS_TYPES_BY_PROGRAM = {
  GE: [
    { name: 'Executive', capacity: 1, meetings: 25, students: '1 student' },
    { name: 'Private', capacity: 2, meetings: 25, students: '2 students' },
    { name: 'Semi Private', capacity: 4, meetings: 25, students: '3-4 students' },
    { name: 'Regular', capacity: 15, meetings: 21, students: '7-15 students' },
  ],
  AE: [
    { name: 'Executive', capacity: 1, meetings: 25, students: '1 student' },
    { name: 'Private', capacity: 2, meetings: 25, students: '2 students' },
    { name: 'Semi Private', capacity: 4, meetings: 25, students: '3-4 students' },
    { name: 'Regular', capacity: 15, meetings: 21, students: '7-15 students' },
  ],
  Foundation: [
    { name: 'Executive', capacity: 1, meetings: 25, students: '1 student' },
    { name: 'Executive Half', capacity: 1, meetings: 12, students: '1 student' },
    { name: 'Private', capacity: 2, meetings: 25, students: '2 students' },
    { name: 'Semi Private', capacity: 4, meetings: 25, students: '3-4 students' },
    { name: 'Regular', capacity: 15, meetings: 21, students: '7-15 students' },
  ],
  IELTS: [
    { name: 'Executive', capacity: 1, meetings: 25, students: '1 student' },
    { name: 'Executive Half', capacity: 1, meetings: 12, students: '1 student' },
    { name: 'Private', capacity: 2, meetings: 25, students: '2 students' },
    { name: 'Semi Private', capacity: 4, meetings: 25, students: '3-4 students' },
    { name: 'Regular', capacity: 15, meetings: 21, students: '7-15 students' },
  ],
  'U-Prep': [
    { name: 'U-Prep Private', capacity: 1, meetings: 25, students: '1 student' },
    { name: 'Half U-Prep', capacity: 1, meetings: 12, students: '1 student' },
    { name: 'U-Assistance', capacity: 1, meetings: 25, students: '1 student' },
    { name: 'Half U-Assistance', capacity: 1, meetings: 12, students: '1 student' },
  ],
}

const AGE_GROUPS = ['Young', 'Teens', 'Adult']
const MODES = ['Offline', 'Online']

// ── HELPERS ────────────────────────────────────────────
function generateStudentId(students) {
  let randomId
  do {
    randomId = Math.random().toString(36).substring(2, 8).toUpperCase()
  } while (students.some(s => s.id === `M--${randomId}`))
  return `M--${randomId}`
}

function generateClassSuffix(classes, prefix) {
  let suffix
  do {
    suffix = Math.random().toString(36).substring(2, 5).toUpperCase()
  } while (classes.some(c => c.name === `${prefix} #${suffix}`))
  return suffix
}

function getClassInfo(program, classType) {
  return CLASS_TYPES_BY_PROGRAM[program]?.find(c => c.name === classType)
}

function isAlwaysNewClass(classType) {
  return [
    'Executive', 'Executive Half',
    'U-Prep Private', 'Half U-Prep',
    'U-Assistance', 'Half U-Assistance'
  ].includes(classType)
}

function getOrCreateClass(classes, program, classType, ageGroup, mode) {
  const classInfo = getClassInfo(program, classType)
  const capacity = classInfo?.capacity || 1
  const prefix = program === 'GE'
    ? `${program}-${classType}-${ageGroup}-${mode}`
    : `${program}-${classType}-${mode}`

  if (isAlwaysNewClass(classType)) {
    const suffix = generateClassSuffix(classes, prefix)
    return { isNew: true, classId: `${prefix} #${suffix}` }
  }

  const existing = classes
    .filter(c => c.name.startsWith(prefix))
    .find(c => c.student_ids.length < capacity)

  if (existing) return { isNew: false, classId: existing.name }

  const suffix = generateClassSuffix(classes, prefix)
  return { isNew: true, classId: `${prefix} #${suffix}` }
}

// ── CHANGE PASSWORD MODAL ──────────────────────────────
function ChangePasswordModal({ user, onClose }) {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSave() {
    setError('')
    setSuccess('')
    if (!oldPassword || !newPassword || !confirmPassword) { setError('Please fill all fields.'); return }
    if (newPassword !== confirmPassword) { setError('New passwords do not match.'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return }
    try {
      await changeAdminPassword(user.id, oldPassword, newPassword)
      setSuccess('Password changed successfully!')
      setTimeout(() => onClose(), 1500)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,15,35,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '400px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
        <div className="modal-header">
          <div>
            <p className="modal-header-label">Account</p>
            <h2 className="modal-header-title">Change Password</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <label>Current Password</label>
          <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Enter current password" />
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />

          {error && (
            <div style={{ background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#E53E3E', marginBottom: '16px' }}>
              ⚠️ {error}
            </div>
          )}
          {success && (
            <div style={{ background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#2E7D32', marginBottom: '16px' }}>
              ✅ {success}
            </div>
          )}

          <div className="modal-footer">
            <button className="btn-cancel" onClick={onClose}>Cancel</button>
            <button className="btn-confirm" onClick={handleSave}>Save Password</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── ADMIN MODAL ────────────────────────────────────────
function AdminModal({ onClose }) {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')

  useEffect(() => { loadAdmins() }, [])

  async function loadAdmins() {
    setLoading(true)
    const data = await getAdmins()
    setAdmins(data)
    setLoading(false)
  }

  async function handleAddAdmin() {
    setError('')
    setSuccess('')
    if (!username) { setError('Please enter a username.'); return }
    if (regPassword !== 'Bridge2026Digital') { setError('Invalid registration password.'); return }
    try {
      const result = await registerAdmin(username, regPassword)
      setNewAdminPassword(result.plain_password)
      setSuccess(`Admin "${username}" created!`)
      setUsername('')
      setRegPassword('')
      loadAdmins()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteAdmin(id) {
    const ok = window.confirm('Delete this admin account?')
    if (!ok) return
    await deleteUser(id)
    loadAdmins()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,15,35,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: 'white', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <div>
            <p className="modal-header-label">Management</p>
            <h2 className="modal-header-title">Admin Accounts</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          <div style={{ background: 'var(--off-white)', borderRadius: '12px', padding: '16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Add New Admin</p>
            <label>Username</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter Admin Username" />
            <label>Registration Password</label>
            <input type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} placeholder="Enter Registration Password" />
            {error && <div style={{ background: 'rgba(229,62,62,0.08)', border: '1px solid rgba(229,62,62,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#E53E3E', marginBottom: '12px' }}>⚠️ {error}</div>}
            {success && (
              <div style={{ background: 'rgba(46,125,50,0.08)', border: '1px solid rgba(46,125,50,0.25)', borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#2E7D32', marginBottom: '12px' }}>
                ✅ {success}
                {newAdminPassword && <p style={{ marginTop: '6px', fontWeight: 700 }}>Password: <span style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', fontFamily: 'monospace' }}>{newAdminPassword}</span></p>}
              </div>
            )}
            <button className="btn-confirm" style={{ width: '100%' }} onClick={handleAddAdmin}>Add Admin</button>
          </div>

          <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>Current Admins ({admins.length})</p>
          {loading ? <p style={{ color: 'var(--gray)', fontSize: '13px' }}>Loading...</p>
            : admins.length === 0 ? <p style={{ color: 'var(--gray)', fontSize: '13px' }}>No admins yet.</p>
            : admins.map((admin, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', borderRadius: '10px', background: 'var(--off-white)', marginBottom: '8px' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--navy)' }}>{admin.username}</p>
                  <p style={{ fontSize: '11px', color: 'var(--gray)' }}>Admin</p>
                </div>
                <button onClick={() => handleDeleteAdmin(admin.id)} style={{ background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.2)', color: '#E53E3E', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Delete</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

// ── STUDENT PASSWORD BADGE ─────────────────────────────
function StudentPasswordBadge({ studentId }) {
  const [userInfo, setUserInfo] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  async function loadUserInfo() {
    if (loaded) { setShowPassword(!showPassword); return }
    setLoading(true)
    const data = await getStudentUser(studentId)
    setUserInfo(data)
    setLoaded(true)
    setShowPassword(true)
    setLoading(false)
  }

  return (
    <div style={{ marginTop: '10px' }}>
      <button onClick={loadUserInfo} style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.08)', color: 'var(--gray-light)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
        {loading ? '...' : showPassword ? 'Hide Password' : 'Show Login Info'}
      </button>
      {showPassword && userInfo && (
        <div style={{ marginTop: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', padding: '10px 12px' }}>
          <p style={{ fontSize: '11px', color: 'var(--gray-light)', marginBottom: '4px' }}><span style={{ color: 'var(--accent-bright)' }}>Username:</span> {userInfo.username}</p>
          <p style={{ fontSize: '11px', color: 'var(--gray-light)' }}><span style={{ color: 'var(--accent-bright)' }}>Password:</span> {userInfo.plain_password}</p>
        </div>
      )}
      {showPassword && !userInfo && (
        <div style={{ marginTop: '8px', background: 'rgba(229,62,62,0.1)', border: '1px solid rgba(229,62,62,0.2)', borderRadius: '8px', padding: '10px 12px', fontSize: '11px', color: '#FC8181' }}>
          ⚠️ No login account yet
        </div>
      )}
    </div>
  )
}

// ── MODAL ──────────────────────────────────────────────
function Modal({ onClose, onConfirm, editData, classes }) {
  const hasAgeGroup = (program) => program === 'GE'
  const TOTAL_STEPS = 5

  const [form, setForm] = useState({
    namaLengkap: editData?.nama_lengkap || '',
    jenisKelamin: editData?.jenis_kelamin || '',
    noTelp: editData?.no_telp || '',
    program: editData?.program || '',
    classType: editData?.class_type || '',
    ageGroup: editData?.age_group || '',
    mode: editData?.mode || '',
  })
  const [step, setStep] = useState(1)

  const stepTitles = {
    1: 'Student Information',
    2: 'Select Program',
    3: 'Select Class Type',
    4: hasAgeGroup(form.program) ? 'Select Age Group & Mode' : 'Select Class Mode',
    5: 'Confirm Enrollment'
  }

  function handleNext() {
    if (step === 1) {
      if (!form.namaLengkap || !form.jenisKelamin || !form.noTelp) { alert('Please fill all fields!'); return }
      if (form.noTelp.length < 10) { alert('Phone number must be at least 10 digits!'); return }
    }
    if (step === 2 && !form.program) { alert('Please select a program!'); return }
    if (step === 3 && !form.classType) { alert('Please select a class type!'); return }
    if (step === 4) {
      if (hasAgeGroup(form.program) && !form.ageGroup) { alert('Please select an age group!'); return }
      if (!form.mode) { alert('Please select a class mode!'); return }
    }
    setStep(step + 1)
  }

  function handleProgramChange(p) {
    setForm({ ...form, program: p, classType: '', ageGroup: '', mode: '' })
  }

  const progressPct = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,15,35,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px', overflowY: 'auto' }}>
      <div style={{ background: 'var(--white)', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.4)', overflow: 'hidden', margin: 'auto', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <div>
            <p className="modal-header-label">{editData ? 'Editing Record' : `Step ${step} of ${TOTAL_STEPS}`}</p>
            <h2 className="modal-header-title">{stepTitles[step]}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>
        <div style={{ height: '3px', background: 'rgba(11,30,62,0.1)', flexShrink: 0 }}>
          <div style={{ height: '100%', width: `${progressPct}%`, background: 'var(--accent)', transition: 'width 0.3s ease' }} />
        </div>
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {step === 1 && (
            <div>
              <label>Full Name</label>
              <input value={form.namaLengkap} onChange={e => setForm({ ...form, namaLengkap: e.target.value })} placeholder="Enter full name" />
              <label>Gender</label>
              <select value={form.jenisKelamin} onChange={e => setForm({ ...form, jenisKelamin: e.target.value })}>
                <option value="">— Select Gender —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label>Phone Number</label>
              <input value={form.noTelp.replace(/(\d{4})(?=\d)/g, '$1-')} onChange={e => { const angkaSaja = e.target.value.replace(/[^0-9]/g, ''); setForm({ ...form, noTelp: angkaSaja }) }} placeholder="e.g. 0812-3456-7890" maxLength={15} />
            </div>
          )}
          {step === 2 && (
            <div>
              <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '16px' }}>Choose the English program that fits the student's goals</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {PROGRAMS.map(p => (
                  <button key={p} onClick={() => handleProgramChange(p)} style={{ padding: '14px 16px', borderRadius: '10px', border: `2px solid ${form.program === p ? 'var(--accent)' : 'var(--gray-light)'}`, background: form.program === p ? 'rgba(74,144,217,0.1)' : 'var(--off-white)', color: form.program === p ? 'var(--blue)' : 'var(--navy)', cursor: 'pointer', fontWeight: form.program === p ? 700 : 500, fontSize: '14px', textAlign: 'left', transition: 'all 0.15s', fontFamily: 'Sora, sans-serif' }}>
                    {form.program === p ? '✓ ' : ''}{p} Programs
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '16px' }}>Choose class type for {form.program} Programs</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {(CLASS_TYPES_BY_PROGRAM[form.program] || []).map(c => (
                  <button key={c.name} onClick={() => setForm({ ...form, classType: c.name })} style={{ padding: '16px', borderRadius: '10px', border: `2px solid ${form.classType === c.name ? 'var(--accent)' : 'var(--gray-light)'}`, background: form.classType === c.name ? 'rgba(74,144,217,0.1)' : 'var(--off-white)', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                    <p style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '13px', color: form.classType === c.name ? 'var(--blue)' : 'var(--navy)', marginBottom: '4px' }}>{form.classType === c.name ? '✓ ' : ''}{c.name}</p>
                    <p style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '2px' }}>👥 {c.students}</p>
                    <p style={{ fontSize: '11px', color: 'var(--gray)' }}>📅 {c.meetings} meetings</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 4 && (
            <div>
              {hasAgeGroup(form.program) && (
                <>
                  <label style={{ marginBottom: '8px', display: 'block' }}>Age Group</label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                    {AGE_GROUPS.map(a => (
                      <button key={a} onClick={() => setForm({ ...form, ageGroup: a })} style={{ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${form.ageGroup === a ? 'var(--accent)' : 'var(--gray-light)'}`, background: form.ageGroup === a ? 'rgba(74,144,217,0.1)' : 'var(--off-white)', color: form.ageGroup === a ? 'var(--blue)' : 'var(--navy)', cursor: 'pointer', fontWeight: form.ageGroup === a ? 700 : 500, fontSize: '13px', fontFamily: 'Sora, sans-serif', transition: 'all 0.15s' }}>
                        {form.ageGroup === a ? '✓ ' : ''}{a === 'Young' ? '🧒 Young' : a === 'Teens' ? '👦 Teens' : '👨 Adult'}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <label style={{ marginBottom: '8px', display: 'block' }}>Class Mode</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {MODES.map(m => (
                  <button key={m} onClick={() => setForm({ ...form, mode: m })} style={{ flex: 1, padding: '14px', borderRadius: '10px', border: `2px solid ${form.mode === m ? 'var(--accent)' : 'var(--gray-light)'}`, background: form.mode === m ? 'rgba(74,144,217,0.1)' : 'var(--off-white)', color: form.mode === m ? 'var(--blue)' : 'var(--navy)', cursor: 'pointer', fontWeight: form.mode === m ? 700 : 500, fontSize: '14px', fontFamily: 'Sora, sans-serif', transition: 'all 0.15s' }}>
                    {form.mode === m ? '✓ ' : ''}{m === 'Offline' ? '🏫 Offline' : '💻 Online'}
                  </button>
                ))}
              </div>
            </div>
          )}
          {step === 5 && (
            <div>
              <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '16px' }}>Please review the enrollment details</p>
              <div style={{ background: 'var(--off-white)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Student Info</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>{form.namaLengkap}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray)' }}>{form.jenisKelamin} · {form.noTelp.replace(/(\d{4})(?=\d)/g, '$1-')}</p>
              </div>
              <div style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.2)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>Class Configuration</p>
                {[
                  { label: 'Program', value: `${form.program} Programs` },
                  { label: 'Class Type', value: form.classType },
                  ...(hasAgeGroup(form.program) ? [{ label: 'Age Group', value: form.ageGroup }] : []),
                  { label: 'Mode', value: form.mode },
                  { label: 'Meetings', value: `${getClassInfo(form.program, form.classType)?.meetings} meetings` },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--gray)' }}>{item.label}</span>
                    <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
              {(() => {
                const { classId, isNew } = getOrCreateClass(classes, form.program, form.classType, form.ageGroup, form.mode)
                return (
                  <div style={{ background: isNew ? 'rgba(240,180,41,0.1)' : 'rgba(46,125,50,0.08)', border: `1px solid ${isNew ? 'rgba(240,180,41,0.3)' : 'rgba(46,125,50,0.2)'}`, borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{isNew ? '🆕' : '✅'}</span>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '2px' }}>{classId}</p>
                      <p style={{ fontSize: '12px', color: 'var(--gray)' }}>{isNew ? 'A new class will be created' : 'Joining existing class'}</p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {step > 1 ? <button className="btn-cancel" onClick={() => setStep(step - 1)}>← Back</button> : <button className="btn-cancel" onClick={onClose}>Cancel</button>}
            {step < TOTAL_STEPS ? <button className="btn-confirm" onClick={handleNext}>Next →</button> : <button className="btn-confirm" onClick={() => onConfirm(form)}>Confirm Enrollment</button>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── STUDENT CARD ────────────────────────────────────────
function StudentCard({ murid, mode, onSelect }) {
  const isClickable = !!mode
  const isUnassigned = murid.class_id === 'Unassigned'

  return (
    <div
      className={`student-card ${isClickable ? 'clickable' : ''}`}
      onClick={() => isClickable && onSelect(murid)}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        border: `1.5px solid ${isUnassigned ? 'rgba(229,62,62,0.5)' : mode === 'delete' ? 'rgba(229,62,62,0.4)' : mode === 'edit' ? 'rgba(90,163,245,0.4)' : 'rgba(255,255,255,0.08)'}`
      }}
    >
      <div className="card-deco" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ background: 'rgba(240,180,41,0.2)', color: 'var(--gold)', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', fontFamily: 'Sora, sans-serif' }}>{murid.program}</span>
        {isUnassigned ? (
          <span style={{ background: 'rgba(229,62,62,0.25)', color: '#FC8181', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', fontFamily: 'Sora, sans-serif' }}>⚠️ Unassigned</span>
        ) : (
          <span style={{ background: murid.mode === 'Online' ? 'rgba(74,144,217,0.2)' : 'rgba(46,125,50,0.2)', color: murid.mode === 'Online' ? 'var(--accent-bright)' : '#81C784', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px' }}>
            {murid.mode === 'Online' ? '💻' : '🏫'} {murid.mode}
          </span>
        )}
      </div>
      <p className="card-name">{murid.nama_lengkap}</p>
      <p className="card-id">{murid.id}</p>
      <div className="card-divider" />
      <div className="card-details">
        <p className="card-detail-item"><span>⚥</span> {murid.jenis_kelamin}</p>
        <p className="card-detail-item"><span>📞</span> {murid.no_telp?.replace(/(\d{4})(?=\d)/g, '$1-')}</p>
        <p className="card-detail-item"><span>👥</span> {murid.class_type}{murid.age_group ? ` · ${murid.age_group}` : ''}</p>
        <p className="card-detail-item" style={{ color: isUnassigned ? '#FC8181' : 'var(--gray-light)' }}><span>🏷️</span> {murid.class_id}</p>
      </div>
      {isUnassigned && (
        <div style={{ marginTop: '12px', background: 'rgba(229,62,62,0.15)', border: '1px solid rgba(229,62,62,0.3)', borderRadius: '8px', padding: '8px 12px', fontSize: '11px', color: '#FC8181', display: 'flex', alignItems: 'center', gap: '6px' }}>
          ⚠️ Class deleted — please edit to reassign
        </div>
      )}
      <StudentPasswordBadge studentId={murid.id} />
    </div>
  )
}

// ── CLASS CARD ──────────────────────────────────────────
function ClassCard({ kelas, students, deleteMode, onSelect }) {
  const classInfo = getClassInfo(kelas.program, kelas.class_type)
  const capacity = classInfo?.capacity || 1
  const count = kelas.student_ids?.length || 0
  const isFull = count >= capacity
  const pct = Math.round((count / capacity) * 100)

  return (
    <div
      className={deleteMode ? 'clickable' : ''}
      onClick={() => deleteMode && onSelect(kelas)}
      style={{
        background: 'linear-gradient(145deg, var(--navy-light), var(--blue))',
        borderRadius: '14px', padding: '20px', color: 'var(--white)',
        cursor: deleteMode ? 'pointer' : 'default',
        border: `1.5px solid ${deleteMode ? 'rgba(229,62,62,0.5)' : isFull ? 'rgba(229,62,62,0.4)' : 'rgba(255,255,255,0.08)'}`,
        transition: 'all 0.2s ease', position: 'relative', overflow: 'hidden'
      }}
      onMouseEnter={e => { if (deleteMode) { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(229,62,62,0.3)' } }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div className="card-deco" />
      {deleteMode && (
        <div style={{ position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(229,62,62,0.85)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '999px', fontFamily: 'Sora, sans-serif', whiteSpace: 'nowrap' }}>
          🗑️ Click to delete
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: deleteMode ? '28px' : '12px' }}>
        <span style={{ background: isFull ? 'rgba(229,62,62,0.2)' : 'rgba(46,125,50,0.2)', color: isFull ? '#FC8181' : '#81C784', fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', fontFamily: 'Sora, sans-serif' }}>
          {isFull ? '🔴 Full' : '🟢 Open'}
        </span>
        <span style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--gray-light)', fontSize: '11px', padding: '4px 10px', borderRadius: '999px' }}>{classInfo?.meetings} meetings</span>
      </div>
      <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{kelas.name}</p>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--gray-light)' }}>Students</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--white)' }}>{count} / {capacity}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: isFull ? 'linear-gradient(90deg, #FC8181, #E53E3E)' : 'linear-gradient(90deg, var(--accent), var(--accent-bright))', borderRadius: '3px', transition: 'width 0.3s' }} />
        </div>
      </div>
      <div className="card-divider" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {count === 0 ? <p style={{ fontSize: '12px', color: 'var(--gray)', fontStyle: 'italic' }}>No students yet</p>
          : kelas.student_ids?.map((sid, i) => {
            const s = students.find(x => x.id === sid)
            return s ? (
              <p key={i} style={{ fontSize: '12px', color: 'var(--gray-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>👤</span> {s.nama_lengkap}
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--accent-bright)' }}>{s.id}</span>
              </p>
            ) : null
          })
        }
      </div>
    </div>
  )
}

// ── MAIN DASHBOARD ──────────────────────────────────────
export default function Dashboard({ onLogout, user }) {
  console.log('user di dashboard:', user)
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('students')
  const [actionMode, setActionMode] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [search, setSearch] = useState('')
  const [searchBy, setSearchBy] = useState('name')
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const [s, c] = await Promise.all([getStudents(), getClasses()])
        setStudents(s)
        setClasses(c)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filtered = students.filter(m => {
    const q = search.toLowerCase()
    if (!q) return true
    if (searchBy === 'name') return m.nama_lengkap?.toLowerCase().includes(q)
    if (searchBy === 'id') return m.id?.toLowerCase().includes(q)
    if (searchBy === 'class') return m.class_id?.toLowerCase().includes(q)
    return true
  })

  async function handleSelect(item) {
    if (viewMode === 'students') {
      if (actionMode === 'delete') {
        const ok = window.confirm(`Delete ${item.nama_lengkap}? This action cannot be undone.`)
        if (!ok) return
        await deleteStudent(item.id)
        const kelas = classes.find(c => c.name === item.class_id)
        if (kelas) {
          const updatedIds = kelas.student_ids.filter(id => id !== item.id)
          await updateClass(kelas.name, { ...kelas, student_ids: updatedIds })
        }
        setStudents(students.filter(s => s.id !== item.id))
        setClasses(classes.map(c => c.name === item.class_id ? { ...c, student_ids: c.student_ids.filter(id => id !== item.id) } : c))
        setActionMode(null)
      } else if (actionMode === 'edit') {
        setSelectedId(item.id)
        setShowModal(true)
      }
    } else {
      if (actionMode === 'delete') {
        const affectedCount = item.student_ids?.length || 0
        const ok = window.confirm(`Delete class "${item.name}"?\n\n${affectedCount > 0 ? `⚠️ ${affectedCount} student(s) will become Unassigned.` : 'This class is empty.'}\n\nThis action cannot be undone.`)
        if (!ok) return
        await deleteClass(item.name)
        if (affectedCount > 0) {
          await Promise.all(item.student_ids.map(sid => { const s = students.find(x => x.id === sid); if (s) return updateStudent(sid, { ...s, class_id: 'Unassigned' }) }))
          setStudents(students.map(s => item.student_ids.includes(s.id) ? { ...s, class_id: 'Unassigned' } : s))
        }
        setClasses(classes.filter(c => c.name !== item.name))
        setActionMode(null)
      }
    }
  }

  async function handleConfirm(form) {
    const studentId = selectedId || generateStudentId(students)

    if (selectedId) {
      const oldStudent = students.find(s => s.id === selectedId)
      const oldClassId = oldStudent?.class_id
      const configChanged = oldStudent.program !== form.program || oldStudent.class_type !== form.classType || oldStudent.age_group !== form.ageGroup || oldStudent.mode !== form.mode

      let newClassId = oldClassId
      let updatedClasses = [...classes]

      if (configChanged || oldClassId === 'Unassigned') {
        if (oldClassId !== 'Unassigned') {
          const oldKelas = updatedClasses.find(c => c.name === oldClassId)
          if (oldKelas) {
            const updatedIds = oldKelas.student_ids.filter(id => id !== selectedId)
            await updateClass(oldClassId, { ...oldKelas, student_ids: updatedIds })
            updatedClasses = updatedClasses.map(c => c.name === oldClassId ? { ...c, student_ids: updatedIds } : c)
          }
        }
        const { classId, isNew } = getOrCreateClass(updatedClasses, form.program, form.classType, form.ageGroup, form.mode)
        newClassId = classId
        if (isNew) {
          const newKelas = { name: classId, program: form.program, class_type: form.classType, age_group: form.ageGroup, mode: form.mode, student_ids: [selectedId] }
          await createClass(newKelas)
          updatedClasses.push(newKelas)
        } else {
          const existingKelas = updatedClasses.find(c => c.name === classId)
          const updatedIds = [...existingKelas.student_ids, selectedId]
          await updateClass(classId, { ...existingKelas, student_ids: updatedIds })
          updatedClasses = updatedClasses.map(c => c.name === classId ? { ...c, student_ids: updatedIds } : c)
        }
      }

      const updatedStudent = { nama_lengkap: form.namaLengkap, jenis_kelamin: form.jenisKelamin, no_telp: form.noTelp, program: form.program, class_type: form.classType, age_group: form.ageGroup, mode: form.mode, class_id: newClassId }
      await updateStudent(selectedId, updatedStudent)
      setStudents(students.map(s => s.id === selectedId ? { ...s, ...updatedStudent } : s))
      setClasses(updatedClasses)
      setSelectedId(null)

    } else {
      const { classId, isNew } = getOrCreateClass(classes, form.program, form.classType, form.ageGroup, form.mode)
      const newStudent = { id: studentId, nama_lengkap: form.namaLengkap, jenis_kelamin: form.jenisKelamin, no_telp: form.noTelp, program: form.program, class_type: form.classType, age_group: form.ageGroup || null, mode: form.mode, class_id: classId }
      await createStudent(newStudent)
      let updatedClasses = [...classes]
      if (isNew) {
        const newKelas = { name: classId, program: form.program, class_type: form.classType, age_group: form.ageGroup || null, mode: form.mode, student_ids: [studentId] }
        await createClass(newKelas)
        updatedClasses.push(newKelas)
      } else {
        const existingKelas = updatedClasses.find(c => c.name === classId)
        const updatedIds = [...existingKelas.student_ids, studentId]
        await updateClass(classId, { ...existingKelas, student_ids: updatedIds })
        updatedClasses = updatedClasses.map(c => c.name === classId ? { ...c, student_ids: updatedIds } : c)
      }
      setStudents([...students, newStudent])
      setClasses(updatedClasses)
      await createStudentUser(studentId)
    }

    setShowModal(false)
    setActionMode(null)
  }

  const editData = selectedId ? students.find(s => s.id === selectedId) : null
  const unassignedCount = students.filter(s => s.class_id === 'Unassigned').length

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', color: 'var(--white)' }}>
        <p style={{ fontFamily: 'Sora', fontSize: '18px', marginBottom: '8px' }}>Loading...</p>
        <p style={{ color: 'var(--gray)', fontSize: '14px' }}>Fetching data from server</p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--navy)', fontFamily: 'DM Sans' }}>

      {/* ── TOPBAR 2 TINGKAT ── */}
      <div style={{
        background: 'linear-gradient(90deg, var(--navy), var(--navy-light))',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(12px)'
      }}>
        {/* Tingkat 1 — Logo + View Toggle + Search */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '12px 24px', gap: '11px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontSize: '20px', color: 'var(--gray-light)', fontFamily: 'Sora', flexShrink: 0 }}>
              Welcome, <b style={{ color: 'var(--white)' }}>{user?.username}</b>
            </span>

          {/* View toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '3px', gap: '2px', flexShrink: 0 }}>
            {[{ key: 'students', label: '👤 Students' }, { key: 'classes', label: '📚 Classes' }].map(v => (
              <button key={v.key} onClick={() => { setViewMode(v.key); setActionMode(null) }} style={{ padding: '5px 12px', borderRadius: '6px', border: 'none', background: viewMode === v.key ? 'var(--accent)' : 'transparent', color: viewMode === v.key ? 'white' : 'var(--gray-light)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'Sora', transition: 'all 0.2s' }}>
                {v.label}
              </button>
            ))}
          </div>

          {/* Search */}
          {viewMode === 'students' && (
            <div className={`search-wrap ${searchFocused ? 'search-focused' : ''}`} style={{ flex: 1, maxWidth: '500px' }}>
              <div className="search-pills">
                {[{ key: 'name', label: '👤 Name' }, { key: 'id', label: '🪪 ID' }, { key: 'class', label: '📚 Class' }].map(opt => (
                  <button key={opt.key} className={`search-pill ${searchBy === opt.key ? 'search-pill-active' : ''}`} onClick={() => { setSearchBy(opt.key); setSearch('') }}>
                    {opt.label}
                  </button>
                ))}
              </div>
              <div className="search-divider" />
              <input className="search-input" value={search} onChange={e => setSearch(e.target.value)} placeholder={searchBy === 'name' ? 'Search by name...' : searchBy === 'id' ? 'Search by ID...' : 'Search by class...'} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
              {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
            </div>
          )}

          <span style={{ fontSize: '12px', color: 'var(--gray)', flexShrink: 0, marginLeft: 'auto' }}>
            {viewMode === 'students' ? `${filtered.length}/${students.length} students` : `${classes.length} classes`}
          </span>
        </div>

        {/* Tingkat 2 — Actions */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px 24px', gap: '8px', flexWrap: 'wrap' }}>

          {unassignedCount > 0 && (
            <span style={{ background: 'rgba(229,62,62,0.2)', color: '#FC8181', fontSize: '12px', fontWeight: 700, padding: '5px 12px', borderRadius: '8px', border: '1px solid rgba(229,62,62,0.3)', cursor: 'pointer' }}
              onClick={() => { setViewMode('students'); setSearchBy('class'); setSearch('Unassigned') }}>
              ⚠️ {unassignedCount} Unassigned
            </span>
          )}

          <button className="btn-add" onClick={() => { setShowModal(true); setSelectedId(null); setActionMode(null) }}>+ Add New</button>

          {viewMode === 'students' && (
            <button className="btn-mode" onClick={() => { setActionMode(actionMode === 'edit' ? null : 'edit'); setSelectedId(null) }}
              style={{ border: `1.5px solid ${actionMode === 'edit' ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`, color: actionMode === 'edit' ? 'var(--gold)' : 'var(--gray-light)', background: actionMode === 'edit' ? 'rgba(240,180,41,0.15)' : 'transparent' }}>
              ✏️ Edit
            </button>
          )}

          <button className="btn-mode" onClick={() => { setActionMode(actionMode === 'delete' ? null : 'delete'); setSelectedId(null) }}
            style={{ border: `1.5px solid ${actionMode === 'delete' ? 'var(--danger)' : 'rgba(255,255,255,0.15)'}`, color: actionMode === 'delete' ? '#FC8181' : 'var(--gray-light)', background: actionMode === 'delete' ? 'rgba(229,62,62,0.15)' : 'transparent' }}>
            🗑️ Delete
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowAdminModal(true)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'var(--gray-light)', cursor: 'pointer', fontSize: '13px', fontFamily: 'Sora', fontWeight: 600 }}>
              👥 Admins
            </button>
            <button onClick={() => setShowChangePassword(true)} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'var(--gray-light)', cursor: 'pointer', fontSize: '13px', fontFamily: 'Sora', fontWeight: 600 }}>
              🔑 Password
            </button>
            <button onClick={onLogout} style={{ padding: '7px 14px', borderRadius: '8px', border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'var(--gray-light)', cursor: 'pointer', fontSize: '13px', fontFamily: 'Sora', fontWeight: 600 }}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {actionMode && (
          <div className="mode-banner" style={{ background: actionMode === 'delete' ? 'rgba(229,62,62,0.1)' : 'rgba(74,144,217,0.1)', border: `1px solid ${actionMode === 'delete' ? 'rgba(229,62,62,0.3)' : 'rgba(74,144,217,0.3)'}` }}>
            <p className="mode-banner-text" style={{ color: actionMode === 'delete' ? '#FC8181' : 'var(--accent-bright)' }}>
              {actionMode === 'delete' && viewMode === 'students' && '🗑️ Click on a student card to delete'}
              {actionMode === 'delete' && viewMode === 'classes' && '🗑️ Click on a class card to delete'}
              {actionMode === 'edit' && '✏️ Click on a student card to edit'}
            </p>
            <button className="btn-cancel-mode" onClick={() => setActionMode(null)}>Cancel</button>
          </div>
        )}

        {viewMode === 'students' && (
          students.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🎓</div>
              <p className="empty-state-title">No Students Yet</p>
              <p className="empty-state-sub">Add your first student to get started</p>
              <button className="btn-add-first" onClick={() => setShowModal(true)}>+ Add First Student</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <p className="empty-state-title">No Results Found</p>
              <p className="empty-state-sub">Try a different search term</p>
              <button className="btn-add-first" onClick={() => setSearch('')}>Clear Search</button>
            </div>
          ) : (
            <div className="student-grid">
              {filtered.map(m => <StudentCard key={m.id} murid={m} mode={actionMode} onSelect={handleSelect} />)}
            </div>
          )
        )}

        {viewMode === 'classes' && (
          classes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📚</div>
              <p className="empty-state-title">No Classes Yet</p>
              <p className="empty-state-sub">Classes will appear here once you add students</p>
            </div>
          ) : (
            <div className="student-grid">
              {classes.map((kelas, i) => <ClassCard key={i} kelas={kelas} students={students} deleteMode={actionMode === 'delete'} onSelect={handleSelect} />)}
            </div>
          )
        )}
      </div>

      {showModal && (
        <Modal onClose={() => { setShowModal(false); setSelectedId(null) }} onConfirm={handleConfirm} editData={editData} classes={classes} />
      )}
      {showAdminModal && (
        <AdminModal onClose={() => setShowAdminModal(false)} />
      )}
      {showChangePassword && (
        <ChangePasswordModal user={user} onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  )
}