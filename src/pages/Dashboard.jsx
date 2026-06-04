import { useState, useEffect } from 'react'
import '../App.css'

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
  // 1. Tentukan karakter yang diizinkan (Tanpa I, B, O, S dan versi kecilnya)
  // Angka 0, 1, 5, 8 tetap dimasukkan. Jika angka juga ingin dibuang, silakan hapus dari string di bawah.
  const allowedChars = 'ACDEFGHJKLMNPQRSTUVWXYZ0123456789'
  let randomId
  
  do {
    // 2. Reset atau setel ulang randomId menjadi string kosong setiap kali perulangan dimulai
    randomId = ''
    
    // 3. Ambil 6 karakter secara acak dari daftar allowedChars
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * allowedChars.length)
      randomId += allowedChars[randomIndex]
    }
    
  } while (students.some(s => s.id === `M--${randomId}`)) // 4. Validasi duplikat seperti biasa
  
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
    .find(c => c.studentIds.length < capacity)

  if (existing) return { isNew: false, classId: existing.name }

  const suffix = generateClassSuffix(classes, prefix)
  return { isNew: true, classId: `${prefix} #${suffix}` }
}

// ── MODAL ──────────────────────────────────────────────
function Modal({ onClose, onConfirm, editData, classes }) {
  const hasAgeGroup = (program) => program === 'GE'
  const TOTAL_STEPS = 5

  const [form, setForm] = useState({
    namaLengkap: editData?.namaLengkap || '',
    jenisKelamin: editData?.jenisKelamin || '',
    noTelp: editData?.noTelp || '',
    program: editData?.program || '',
    classType: editData?.classType || '',
    ageGroup: editData?.ageGroup || '',
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
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(5,15,35,0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '16px',
      overflowY: 'auto'
    }}>
      <div style={{
        background: 'var(--white)',
        borderRadius: '16px',
        width: '100%', maxWidth: '480px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        margin: 'auto',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header — fixed */}
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <div>
            <p className="modal-header-label">
              {editData ? 'Editing Record' : `Step ${step} of ${TOTAL_STEPS}`}
            </p>
            <h2 className="modal-header-title">{stepTitles[step]}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Progress bar — fixed */}
        <div style={{ height: '3px', background: 'rgba(11,30,62,0.1)', flexShrink: 0 }}>
          <div style={{
            height: '100%', width: `${progressPct}%`,
            background: 'var(--accent)', transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Body — scrollable */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          flex: 1
        }}>

          {/* Step 1 — Student Info */}
          {step === 1 && (
            <div>
              <label>Full Name</label>
              <input
                value={form.namaLengkap}
                onChange={e => setForm({ ...form, namaLengkap: e.target.value })}
                placeholder="Enter full name"
              />
              <label>Gender</label>
              <select
                value={form.jenisKelamin}
                onChange={e => setForm({ ...form, jenisKelamin: e.target.value })}
              >
                <option value="">— Select Gender —</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label>Phone Number</label>
              <input
                value={form.noTelp.replace(/(\d{4})(?=\d)/g, '$1-')}
                onChange={e => {
                  const angkaSaja = e.target.value.replace(/[^0-9]/g, '')
                  setForm({ ...form, noTelp: angkaSaja })
                }}
                placeholder="e.g. 0812-3456-7890"
                maxLength={15}
              />
            </div>
          )}

          {/* Step 2 — Program */}
          {step === 2 && (
            <div>
              <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '16px' }}>
                Choose the English program that fits the student's goals
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {PROGRAMS.map(p => (
                  <button key={p} onClick={() => handleProgramChange(p)} style={{
                    padding: '14px 16px', borderRadius: '10px',
                    border: `2px solid ${form.program === p ? 'var(--accent)' : 'var(--gray-light)'}`,
                    background: form.program === p ? 'rgba(74,144,217,0.1)' : 'var(--off-white)',
                    color: form.program === p ? 'var(--blue)' : 'var(--navy)',
                    cursor: 'pointer', fontWeight: form.program === p ? 700 : 500,
                    fontSize: '14px', textAlign: 'left', transition: 'all 0.15s',
                    fontFamily: 'Sora, sans-serif'
                  }}>
                    {form.program === p ? '✓ ' : ''}{p} Programs
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3 — Class Type */}
          {step === 3 && (
            <div>
              <p style={{ color: 'var(--gray)', fontSize: '13px', marginBottom: '16px' }}>
                Choose class type for {form.program} Programs
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {(CLASS_TYPES_BY_PROGRAM[form.program] || []).map(c => (
                  <button key={c.name} onClick={() => setForm({ ...form, classType: c.name })} style={{
                    padding: '16px', borderRadius: '10px',
                    border: `2px solid ${form.classType === c.name ? 'var(--accent)' : 'var(--gray-light)'}`,
                    background: form.classType === c.name ? 'rgba(74,144,217,0.1)' : 'var(--off-white)',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
                  }}>
                    <p style={{
                      fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '13px',
                      color: form.classType === c.name ? 'var(--blue)' : 'var(--navy)', marginBottom: '4px'
                    }}>
                      {form.classType === c.name ? '✓ ' : ''}{c.name}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '2px' }}>👥 {c.students}</p>
                    <p style={{ fontSize: '11px', color: 'var(--gray)' }}>📅 {c.meetings} meetings</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 — Age Group (GE only) + Mode */}
          {step === 4 && (
            <div>
              {hasAgeGroup(form.program) && (
                <>
                  <label style={{ marginBottom: '8px', display: 'block' }}>Age Group</label>
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                    {AGE_GROUPS.map(a => (
                      <button key={a} onClick={() => setForm({ ...form, ageGroup: a })} style={{
                        flex: 1, padding: '12px', borderRadius: '10px',
                        border: `2px solid ${form.ageGroup === a ? 'var(--accent)' : 'var(--gray-light)'}`,
                        background: form.ageGroup === a ? 'rgba(74,144,217,0.1)' : 'var(--off-white)',
                        color: form.ageGroup === a ? 'var(--blue)' : 'var(--navy)',
                        cursor: 'pointer', fontWeight: form.ageGroup === a ? 700 : 500,
                        fontSize: '13px', fontFamily: 'Sora, sans-serif', transition: 'all 0.15s'
                      }}>
                        {form.ageGroup === a ? '✓ ' : ''}
                        {a === 'Young' ? '🧒 Young' : a === 'Teens' ? '👦 Teens' : '👨 Adult'}
                      </button>
                    ))}
                  </div>
                </>
              )}

              <label style={{ marginBottom: '8px', display: 'block' }}>Class Mode</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {MODES.map(m => (
                  <button key={m} onClick={() => setForm({ ...form, mode: m })} style={{
                    flex: 1, padding: '14px', borderRadius: '10px',
                    border: `2px solid ${form.mode === m ? 'var(--accent)' : 'var(--gray-light)'}`,
                    background: form.mode === m ? 'rgba(74,144,217,0.1)' : 'var(--off-white)',
                    color: form.mode === m ? 'var(--blue)' : 'var(--navy)',
                    cursor: 'pointer', fontWeight: form.mode === m ? 700 : 500,
                    fontSize: '14px', fontFamily: 'Sora, sans-serif', transition: 'all 0.15s'
                  }}>
                    {form.mode === m ? '✓ ' : ''}{m === 'Offline' ? '🏫 Offline' : '💻 Online'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 5 — Summary */}
          {step === 5 && (
            <div>


              <div style={{ background: 'var(--off-white)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--gray)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Student Info
                </p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>{form.namaLengkap}</p>
                <p style={{ fontSize: '13px', color: 'var(--gray)' }}>{form.jenisKelamin} · {form.noTelp.replace(/(\d{4})(?=\d)/g, '$1-')}</p>
              </div>

              <div style={{ background: 'rgba(74,144,217,0.08)', border: '1px solid rgba(74,144,217,0.2)', borderRadius: '10px', padding: '16px', marginBottom: '12px' }}>
                <p style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Class Configuration
                </p>
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
                  <div style={{
                    background: isNew ? 'rgba(240,180,41,0.1)' : 'rgba(46,125,50,0.08)',
                    border: `1px solid ${isNew ? 'rgba(240,180,41,0.3)' : 'rgba(46,125,50,0.2)'}`,
                    borderRadius: '10px', padding: '12px 16px',
                    display: 'flex', alignItems: 'center', gap: '10px'
                  }}>
                    <span style={{ fontSize: '20px' }}>{isNew ? '🆕' : '✅'}</span>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy)', marginBottom: '2px', textAlign: 'left' }}>
                        {classId}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--gray)', textAlign: 'left', margin: 0 }}>
                        {isNew ? 'A new class will be created' : 'Joining existing class'}
                      </p>
                    </div>
                  </div>
                )
              })()}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {step > 1
              ? <button className="btn-cancel" onClick={() => setStep(step - 1)}>← Back</button>
              : <button className="btn-cancel" onClick={onClose}>Cancel</button>
            }
            {step < TOTAL_STEPS
              ? <button className="btn-confirm" onClick={handleNext}>Next →</button>
              : <button className="btn-confirm" onClick={() => onConfirm(form)}>Confirm Enrollment</button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

// ── STUDENT CARD ────────────────────────────────────────
function StudentCard({ murid, mode, onSelect }) {
  const isClickable = !!mode
  const isUnassigned = murid.classId === 'Unassigned'

  return (
    <div
      className={`student-card ${isClickable ? 'clickable' : ''}`}
      onClick={() => isClickable && onSelect(murid)}
      style={{
        cursor: isClickable ? 'pointer' : 'default',
        border: `1.5px solid ${
          isUnassigned ? 'rgba(229,62,62,0.5)'
          : mode === 'delete' ? 'rgba(229,62,62,0.4)'
          : mode === 'edit' ? 'rgba(90,163,245,0.4)'
          : 'rgba(255,255,255,0.08)'
        }`
      }}
    >
      <div className="card-deco" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{
          background: 'rgba(240,180,41,0.2)', color: 'var(--gold)',
          fontSize: '11px', fontWeight: 700, padding: '4px 10px',
          borderRadius: '999px', fontFamily: 'Sora, sans-serif'
        }}>
          {murid.program}
        </span>
        {isUnassigned ? (
          <span style={{
            background: 'rgba(229,62,62,0.25)', color: '#FC8181',
            fontSize: '11px', fontWeight: 700, padding: '4px 10px',
            borderRadius: '999px', fontFamily: 'Sora, sans-serif'
          }}>
            ⚠️ Unassigned
          </span>
        ) : (
          <span style={{
            background: murid.mode === 'Online' ? 'rgba(74,144,217,0.2)' : 'rgba(46,125,50,0.2)',
            color: murid.mode === 'Online' ? 'var(--accent-bright)' : '#81C784',
            fontSize: '11px', fontWeight: 700, padding: '4px 10px', borderRadius: '999px',
          }}>
            {murid.mode === 'Online' ? '💻' : '🏫'} {murid.mode}
          </span>
        )}
      </div>

      <p className="card-name">{murid.namaLengkap}</p>
      <p className="card-id">{murid.id}</p>
      <div className="card-divider" />
      <div className="card-details">
        <p className="card-detail-item"><span>⚥</span> {murid.jenisKelamin}</p>
        <p className="card-detail-item"><span>📞</span> {murid.noTelp.replace(/(\d{4})(?=\d)/g, '$1-')}</p>
        <p className="card-detail-item"><span>👥</span> {murid.classType}{murid.ageGroup ? ` · ${murid.ageGroup}` : ''}</p>
        <p className="card-detail-item" style={{ color: isUnassigned ? '#FC8181' : 'var(--gray-light)' }}>
          <span>🏷️</span> {murid.classId}
        </p>
      </div>

      {isUnassigned && (
        <div style={{
          marginTop: '12px', background: 'rgba(229,62,62,0.15)',
          border: '1px solid rgba(229,62,62,0.3)', borderRadius: '8px',
          padding: '8px 12px', fontSize: '11px', color: '#FC8181',
          display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          ⚠️ Class deleted — please edit to reassign
        </div>
      )}
    </div>
  )
}

// ── CLASS CARD ──────────────────────────────────────────
function ClassCard({ kelas, students, deleteMode, onSelect }) {
  const classInfo = getClassInfo(kelas.program, kelas.classType)
  const capacity = classInfo?.capacity || 1
  const count = kelas.studentIds.length
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
        border: `1.5px solid ${
          deleteMode ? 'rgba(229,62,62,0.5)'
          : isFull ? 'rgba(229,62,62,0.4)'
          : 'rgba(255,255,255,0.08)'
        }`,
        transition: 'all 0.2s ease',
        position: 'relative', overflow: 'hidden'
      }}
      onMouseEnter={e => {
        if (deleteMode) {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(229,62,62,0.3)'
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div className="card-deco" />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: deleteMode ? '28px' : '12px' }}>
        <span style={{
          background: isFull ? 'rgba(229,62,62,0.2)' : 'rgba(46,125,50,0.2)',
          color: isFull ? '#FC8181' : '#81C784',
          fontSize: '11px', fontWeight: 700, padding: '4px 10px',
          borderRadius: '999px', fontFamily: 'Sora, sans-serif'
        }}>
          {isFull ? '🔴 Full' : '🟢 Open'}
        </span>
        <span style={{
          background: 'rgba(255,255,255,0.1)', color: 'var(--gray-light)',
          fontSize: '11px', padding: '4px 10px', borderRadius: '999px'
        }}>
          {classInfo?.meetings} meetings
        </span>
      </div>

      <p style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{kelas.name}</p>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '12px', color: 'var(--gray-light)' }}>Students</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--white)' }}>{count} / {capacity}</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}>
          <div style={{
            height: '100%', width: `${pct}%`,
            background: isFull
              ? 'linear-gradient(90deg, #FC8181, #E53E3E)'
              : 'linear-gradient(90deg, var(--accent), var(--accent-bright))',
            borderRadius: '3px', transition: 'width 0.3s'
          }} />
        </div>
      </div>

      <div className="card-divider" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {kelas.studentIds.length === 0 ? (
          <p style={{ fontSize: '12px', color: 'var(--gray)', fontStyle: 'italic' }}>No students yet</p>
        ) : (
          kelas.studentIds.map((sid, i) => {
            const s = students.find(x => x.id === sid)
            return s ? (
              <p key={i} style={{ fontSize: '12px', color: 'var(--gray-light)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>👤</span> {s.namaLengkap}
                <span style={{ marginLeft: 'auto', fontSize: '11px', color: 'var(--accent-bright)' }}>{s.id}</span>
              </p>
            ) : null
          })
        )}
      </div>
    </div>
  )
}

// ── MAIN DASHBOARD ──────────────────────────────────────
export default function Dashboard({ onLogout }) {
  const [students, setStudents] = useState([])
  const [classes, setClasses] = useState([])
  const [sudahLoad, setSudahLoad] = useState(false)
  const [viewMode, setViewMode] = useState('students')
  const [actionMode, setActionMode] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [searchBy, setSearchBy] = useState('name')
  const [searchFocused, setSearchFocused] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('dataMurid')
    const c = localStorage.getItem('dataKelas')
    if (s) setStudents(JSON.parse(s))
    if (c) setClasses(JSON.parse(c))
    setSudahLoad(true)
  }, [])

  useEffect(() => {
    if (sudahLoad) {
      localStorage.setItem('dataMurid', JSON.stringify(students))
      localStorage.setItem('dataKelas', JSON.stringify(classes))
    }
  }, [students, classes, sudahLoad])

  const filtered = students.filter(m => {
    const q = search.toLowerCase()
    if (!q) return true
    if (searchBy === 'name') return m.namaLengkap.toLowerCase().includes(q)
    if (searchBy === 'id') return m.id.toLowerCase().includes(q)
    if (searchBy === 'class') return m.classId?.toLowerCase().includes(q)
    return true
  })

  function handleSelect(item) {
    if (viewMode === 'students') {
      if (actionMode === 'delete') {
        const ok = window.confirm(`Delete ${item.namaLengkap}? This action cannot be undone.`)
        if (!ok) return
        setClasses(classes.map(c => ({ ...c, studentIds: c.studentIds.filter(id => id !== item.id) })))
        setStudents(students.filter(x => x.id !== item.id))
        setActionMode(null)
      } else if (actionMode === 'edit') {
        setSelectedId(item.id)
        setShowModal(true)
      }
    } else {
      if (actionMode === 'delete') {
        const affectedCount = item.studentIds.length
        const ok = window.confirm(
          `Delete class "${item.name}"?\n\n${affectedCount > 0
            ? `⚠️ ${affectedCount} student(s) will become Unassigned and need to be reassigned.`
            : 'This class is empty.'
          }\n\nThis action cannot be undone.`
        )
        if (!ok) return
        setClasses(classes.filter(c => c.name !== item.name))
        if (affectedCount > 0) {
          setStudents(students.map(s =>
            item.studentIds.includes(s.id) ? { ...s, classId: 'Unassigned' } : s
          ))
        }
        setActionMode(null)
      }
    }
  }

  function handleConfirm(form) {
    const studentId = selectedId || generateStudentId(students)

    if (selectedId) {
      const oldStudent = students.find(s => s.id === selectedId)
      const oldClassId = oldStudent?.classId
      const configChanged =
        oldStudent.program !== form.program ||
        oldStudent.classType !== form.classType ||
        oldStudent.ageGroup !== form.ageGroup ||
        oldStudent.mode !== form.mode

      let newClassId = oldClassId
      let updatedClasses = [...classes]

      if (configChanged || oldClassId === 'Unassigned') {
        if (oldClassId !== 'Unassigned') {
          updatedClasses = updatedClasses.map(c => ({
            ...c, studentIds: c.studentIds.filter(id => id !== selectedId)
          }))
        }
        const { classId, isNew } = getOrCreateClass(updatedClasses, form.program, form.classType, form.ageGroup, form.mode)
        newClassId = classId
        if (isNew) {
          updatedClasses.push({ name: classId, program: form.program, classType: form.classType, ageGroup: form.ageGroup, mode: form.mode, studentIds: [selectedId] })
        } else {
          updatedClasses = updatedClasses.map(c => c.name === classId ? { ...c, studentIds: [...c.studentIds, selectedId] } : c)
        }
      }

      setClasses(updatedClasses)
      setStudents(students.map(s => s.id === selectedId ? { ...s, ...form, classId: newClassId } : s))
      setSelectedId(null)

    } else {
      const { classId, isNew } = getOrCreateClass(classes, form.program, form.classType, form.ageGroup, form.mode)
      const newStudent = { id: studentId, ...form, classId }
      let updatedClasses = [...classes]
      if (isNew) {
        updatedClasses.push({ name: classId, program: form.program, classType: form.classType, ageGroup: form.ageGroup, mode: form.mode, studentIds: [studentId] })
      } else {
        updatedClasses = updatedClasses.map(c => c.name === classId ? { ...c, studentIds: [...c.studentIds, studentId] } : c)
      }
      setClasses(updatedClasses)
      setStudents([...students, newStudent])
    }

    setShowModal(false)
    setActionMode(null)
  }

  const editData = selectedId ? students.find(s => s.id === selectedId) : null
  const unassignedCount = students.filter(s => s.classId === 'Unassigned').length

  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'var(--navy)', fontFamily: 'DM Sans' }}>

      {/* Topbar */}
      <div className="topbar">
        <p className="topbar-logo-title">Bridge Education</p>

        {viewMode === 'students' && (
          <div className={`search-wrap ${searchFocused ? 'search-focused' : ''}`}>
            <div className="search-pills">
              {[
                { key: 'name', label: '👤 Name' },
                { key: 'id', label: '🪪 ID' },
                { key: 'class', label: '📚 Class' }
              ].map(opt => (
                <button
                  key={opt.key}
                  className={`search-pill ${searchBy === opt.key ? 'search-pill-active' : ''}`}
                  onClick={() => { setSearchBy(opt.key); setSearch('') }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <div className="search-divider" />
            <input
              className="search-input"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={
                searchBy === 'name' ? 'Search by name...'
                : searchBy === 'id' ? 'Search by ID...'
                : 'Search by class...'
              }
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            {search && <button className="search-clear" onClick={() => setSearch('')}>✕</button>}
          </div>
        )}

        <div className="topbar-actions">
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '3px', gap: '2px' }}>
            {[
              { key: 'students', label: '👤 Students' },
              { key: 'classes', label: '📚 Classes' }
            ].map(v => (
              <button key={v.key} onClick={() => { setViewMode(v.key); setActionMode(null) }} style={{
                padding: '6px 14px', borderRadius: '6px', border: 'none',
                background: viewMode === v.key ? 'var(--accent)' : 'transparent',
                color: viewMode === v.key ? 'white' : 'var(--gray-light)',
                cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                fontFamily: 'Sora', transition: 'all 0.2s'
              }}>
                {v.label}
              </button>
            ))}
          </div>

          <span className="topbar-count">
            {viewMode === 'students' ? `${filtered.length}/${students.length} students` : `${classes.length} classes`}
          </span>

          {unassignedCount > 0 && (
            <span
              style={{
                background: 'rgba(229,62,62,0.2)', color: '#FC8181',
                fontSize: '12px', fontWeight: 700, padding: '6px 12px',
                borderRadius: '8px', border: '1px solid rgba(229,62,62,0.3)', cursor: 'pointer'
              }}
              onClick={() => { setViewMode('students'); setSearchBy('class'); setSearch('Unassigned') }}
            >
              ⚠️ {unassignedCount} Unassigned
            </span>
          )}

          <button className="btn-add" onClick={() => { setShowModal(true); setSelectedId(null); setActionMode(null) }}>
            + Add New
          </button>

          {viewMode === 'students' && (
            <button
              className="btn-mode"
              onClick={() => { setActionMode(actionMode === 'edit' ? null : 'edit'); setSelectedId(null) }}
              style={{
                border: `1.5px solid ${actionMode === 'edit' ? 'var(--gold)' : 'rgba(255,255,255,0.15)'}`,
                color: actionMode === 'edit' ? 'var(--gold)' : 'var(--gray-light)',
                background: actionMode === 'edit' ? 'rgba(240,180,41,0.15)' : 'transparent'
              }}
            >
              ✏️ Edit
            </button>
          )}

          <button
            className="btn-mode"
            onClick={() => { setActionMode(actionMode === 'delete' ? null : 'delete'); setSelectedId(null) }}
            style={{
              border: `1.5px solid ${actionMode === 'delete' ? 'var(--danger)' : 'rgba(255,255,255,0.15)'}`,
              color: actionMode === 'delete' ? '#FC8181' : 'var(--gray-light)',
              background: actionMode === 'delete' ? 'rgba(229,62,62,0.15)' : 'transparent'
            }}
          >
            🗑️ Delete
          </button>

          <button onClick={onLogout} style={{
            padding: '8px 14px', borderRadius: '8px',
            border: '1.5px solid rgba(255,255,255,0.15)',
            background: 'transparent', color: 'var(--gray-light)',
            cursor: 'pointer', fontSize: '13px', fontFamily: 'Sora', fontWeight: 600
          }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        {actionMode && (
          <div className="mode-banner" style={{
            background: actionMode === 'delete' ? 'rgba(229,62,62,0.1)' : 'rgba(74,144,217,0.1)',
            border: `1px solid ${actionMode === 'delete' ? 'rgba(229,62,62,0.3)' : 'rgba(74,144,217,0.3)'}`
          }}>
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
              {filtered.map(m => (
                <StudentCard key={m.id} murid={m} mode={actionMode} onSelect={handleSelect} />
              ))}
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
              {classes.map((kelas, i) => (
                <ClassCard key={i} kelas={kelas} students={students} deleteMode={actionMode === 'delete'} onSelect={handleSelect} />
              ))}
            </div>
          )
        )}
      </div>

      {showModal && (
        <Modal
          onClose={() => { setShowModal(false); setSelectedId(null) }}
          onConfirm={handleConfirm}
          editData={editData}
          classes={classes}
        />
      )}
    </div>
  )
}