import React, { useState } from 'react'
import Login from './pages/Login'
import Users from './pages/Users'

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('rp_token'))

  const handleLogin = (t) => {
    localStorage.setItem('rp_token', t)
    setToken(t)
  }

  const handleLogout = () => {
    localStorage.removeItem('rp_token')
    setToken(null)
  }

  return (
    <div className="container">
      <header className="header">
        <h1>RealPlaza - Mantenimiento Usuarios</h1>
        {token && <button className="btn" onClick={handleLogout}>Cerrar sesión</button>}
      </header>

      <main>
        {!token ? <Login onLogin={handleLogin} /> : <Users token={token} />}
      </main>
    </div>
  )
}
