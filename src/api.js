const BASE_URL = 'http://localhost:8000/api'

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