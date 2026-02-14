import React, { useState } from 'react'
import { login } from '../api'

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try {
      const data = await login(username, password)
      onLogin(data.token)
    } catch (err) {
      setError('Usuario o contraseña inválidos')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card card form-card">
        <h2>Iniciar sesión</h2>
        <form className="login-form" onSubmit={submit}>
          <label>Usuario</label>
          <input value={username} onChange={e => setUsername(e.target.value)} />

          <label>Contraseña</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} />

          <div className="form-actions">
            <button className="btn btn-primary" type="submit">Entrar</button>
          </div>

          {error && <div className="error">{error}</div>}
        </form>
      </div>
    </div>
  )
}
