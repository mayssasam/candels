const USERS_KEY = 'candels_users'
const SESSION_KEY = 'candels_session'

export function getUsers() {
  const raw = localStorage.getItem(USERS_KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function registerUser({ name, email, password }) {
  const users = getUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const exists = users.some((user) => user.email.toLowerCase() === normalizedEmail)
  if (exists) {
    return { ok: false, message: 'This email is already registered.' }
  }

  users.push({
    id: Date.now(),
    name: name.trim(),
    email: normalizedEmail,
    password,
  })

  saveUsers(users)
  return { ok: true, message: 'Account created successfully.' }
}

export function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase()
  const users = getUsers()

  const user = users.find(
    (candidate) => candidate.email.toLowerCase() === normalizedEmail && candidate.password === password,
  )

  if (!user) {
    return { ok: false, message: 'Invalid email or password.' }
  }

  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ name: user.name, email: user.email, loggedInAt: Date.now() }),
  )

  return { ok: true, message: 'Login successful.' }
}

export function getSessionUser() {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw)
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY)
}
