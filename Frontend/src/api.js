const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!res.ok) throw new Error('Login falló')
  return res.json()
}

export function authHeaders(token) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

export async function fetchUsers(token) {
  const res = await fetch(`${API_URL}/api/users`, { headers: authHeaders(token) })
  if (!res.ok) throw new Error('No autorizado')
  return res.json()
}

export async function createUser(token, payload) {
  const res = await fetch(`${API_URL}/api/users`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(payload) })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error al crear usuario (${res.status})`)
  }
  return res.json()
}

export async function updateUser(token, id, payload) {
  const res = await fetch(`${API_URL}/api/users/${id}`, { method: 'PUT', headers: authHeaders(token), body: JSON.stringify(payload) })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error al actualizar usuario (${res.status})`)
  }
  return res
}

export async function deleteUser(token, id) {
  const res = await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE', headers: authHeaders(token) })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Error al eliminar usuario (${res.status})`)
  }
  return res
}
