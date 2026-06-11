const BASE_URL = 'https://bridge-education-production.up.railway.app/api'
const AUTH_URL = 'https://bridge-education-production.up.railway.app/auth'

// ── STUDENTS ──────────────────────────────────────────

export async function getStudents() {
  const res = await fetch(`${BASE_URL}/students`)
  return res.json()
}

export async function createStudent(student) {
  const res = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  return res.json()
}

export async function updateStudent(id, student) {
  const res = await fetch(`${BASE_URL}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  })
  return res.json()
}

export async function deleteStudent(id) {
  await fetch(`${BASE_URL}/students/${id}`, { method: 'DELETE' })
}

// ── CLASSES ───────────────────────────────────────────

export async function getClasses() {
  const res = await fetch(`${BASE_URL}/classes`)
  return res.json()
}

export async function createClass(kelas) {
  const res = await fetch(`${BASE_URL}/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kelas)
  })
  return res.json()
}

export async function updateClass(name, kelas) {
  const encodedName = encodeURIComponent(name)
  const res = await fetch(`${BASE_URL}/classes/${encodedName}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kelas)
  })
  return res.json()
}

export async function deleteClass(name) {
  const encodedName = encodeURIComponent(name)
  await fetch(`${BASE_URL}/classes/${encodedName}`, { method: 'DELETE' })
}

// ── AUTH ──────────────────────────────────────────────

export async function login(username, password) {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) throw new Error('Invalid username or password')
  return res.json()
}

export async function registerAdmin(username, password) {
  const res = await fetch(`${AUTH_URL}/register-admin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role: 'admin' })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail)
  }
  return res.json()
}

export async function createStudentUser(studentId) {
  const res = await fetch(`${AUTH_URL}/create-student-user?student_id=${studentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  })
  return res.json()
}

export async function getStudentUser(studentId) {
  const res = await fetch(`${AUTH_URL}/student-user/${studentId}`)
  if (!res.ok) return null
  return res.json()
}

export async function changePassword(userId, oldPassword, newPassword) {
  const res = await fetch(`${AUTH_URL}/change-password?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail)
  }
  return res.json()
}

export async function getAdmins() {
  const res = await fetch(`${AUTH_URL}/admins`)
  return res.json()
}

export async function deleteUser(userId) {
  await fetch(`${AUTH_URL}/users/${userId}`, { method: 'DELETE' })
}

export async function changeAdminPassword(userId, oldPassword, newPassword) {
  const res = await fetch(`${AUTH_URL}/change-admin-password?user_id=${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ old_password: oldPassword, new_password: newPassword })
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.detail)
  }
  return res.json()
}

// ── SYLLABUS ───────────────────────────────────────────

export async function getSyllabi() {
  const res = await fetch(`${BASE_URL}/syllabus`)
  return res.json()
}

export async function createSyllabus(item) {
  const res = await fetch(`${BASE_URL}/syllabus`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  })
  return res.json()
}

