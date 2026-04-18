import { API_BASE_URL } from './api'

const SESSION_KEY = 'candels_session'

export async function registerUser({ name, email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const payload = await response.json()

    if (!response.ok) {
      return { ok: false, message: payload.message || 'Unable to create account.' }
    }

    return { ok: true, message: payload.message, user: payload.user }
  } catch {
    return { ok: false, message: 'Server unavailable. Please try again.' }
  }
}

export async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const payload = await response.json()

    if (!response.ok) {
      return { ok: false, message: payload.message || 'Invalid email or password.' }
    }

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        id: payload.user.id,
        name: payload.user.name,
        email: payload.user.email,
        loggedInAt: Date.now(),
      }),
    )

    return { ok: true, message: payload.message, user: payload.user }
  } catch {
    return { ok: false, message: 'Server unavailable. Please try again.' }
  }
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
