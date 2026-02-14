import React, { useEffect, useState } from 'react'
import { fetchUsers, createUser, updateUser, deleteUser } from '../api'
import { getUserRole } from '../utils'

export default function Users({ token }) {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editing, setEditing] = useState(null)
  const userRole = getUserRole(token)
  const isAdmin = userRole === 'admin'

  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    dateOfBirth: '',
    role: 'user',
    department: '',
    phoneNumber: '',
    canEditUsers: false,
    canDeleteUsers: false,
    canViewReports: false,
    isActive: true
  })

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchUsers(token)
      setUsers(data)
    } catch (e) {
      console.error(e)
      setError('No se pudieron cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleChange = (k, v) => setForm((prev) => ({ ...prev, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    
    if (!isAdmin) {
      setError('Solo administradores pueden crear usuarios')
      return
    }

    try {
      const payload = {
        username: form.username,
        password: form.password,
        email: form.email,
        dateOfBirth: form.dateOfBirth || null,
        role: form.role,
        department: form.department,
        phoneNumber: form.phoneNumber,
        canEditUsers: form.canEditUsers,
        canDeleteUsers: form.canDeleteUsers,
        canViewReports: form.canViewReports,
        isActive: form.isActive
      }

      if (editing) {
        await updateUser(token, editing.id, payload)
        setEditing(null)
      } else {
        await createUser(token, payload)
      }
      resetForm()
      await load()
    } catch (err) {
      console.error('Error detallado:', err)
      setError(err.message || 'Error al guardar')
    }
  }

  const resetForm = () => {
    setForm({
      username: '',
      password: '',
      email: '',
      dateOfBirth: '',
      role: 'user',
      department: '',
      phoneNumber: '',
      canEditUsers: false,
      canDeleteUsers: false,
      canViewReports: false,
      isActive: true
    })
    setEditing(null)
  }

  const startEdit = (u) => {
    setEditing(u)
    setForm({
      username: u.username,
      password: '',
      email: u.email || '',
      dateOfBirth: u.dateOfBirth ? new Date(u.dateOfBirth).toISOString().slice(0, 10) : '',
      role: u.role || 'user',
      department: u.department || '',
      phoneNumber: u.phoneNumber || '',
      canEditUsers: u.canEditUsers || false,
      canDeleteUsers: u.canDeleteUsers || false,
      canViewReports: u.canViewReports || false,
      isActive: u.isActive
    })
    setError(null)
  }

  const remove = async (id) => {
    if (!isAdmin) {
      setError('Solo administradores pueden eliminar usuarios')
      return
    }
    if (!confirm('¿Eliminar este usuario permanentemente?')) return
    try {
      await deleteUser(token, id)
      await load()
    } catch (err) {
      setError(err.message || 'Error al eliminar')
    }
  }

  return (
    <div className="users-container">
      {isAdmin && (
        <div className="card form-card">
          <h2>{editing ? '✏️ Editar Usuario' : '➕ Crear Nuevo Usuario'}</h2>
          <form onSubmit={submit} className="user-form">
            <div className="form-row">
              <div className="form-group">
                <label>Usuario (obligatorio)</label>
                <input
                  value={form.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  required
                  disabled={!!editing}
                  placeholder="Ingresar nombre de usuario"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="correo@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Contraseña {editing && '(dejar vacío para no cambiar)'}</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  required={!editing}
                  placeholder={editing ? '••••••••' : 'Ingresar contraseña'}
                />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input
                  value={form.phoneNumber}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Departamento</label>
                <select value={form.department} onChange={(e) => handleChange('department', e.target.value)}>
                  <option value="">Seleccionar...</option>
                  <option value="IT">Informática</option>
                  <option value="HR">Recursos Humanos</option>
                  <option value="Finance">Finanzas</option>
                  <option value="Sales">Ventas</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Rol</label>
                <select value={form.role} onChange={(e) => handleChange('role', e.target.value)}>
                  <option value="user">Usuario Regular</option>
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                </select>
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={form.isActive ? 'active' : 'inactive'} onChange={(e) => handleChange('isActive', e.target.value === 'active')}>
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="permissions-section">
              <h4>🔐 Permisos y Accesos</h4>
              <div className="checkbox-grid">
                <label className="checkbox-item">
                  <input type="checkbox" checked={form.canEditUsers} onChange={(e) => handleChange('canEditUsers', e.target.checked)} />
                  <span>Puede editar usuarios</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" checked={form.canDeleteUsers} onChange={(e) => handleChange('canDeleteUsers', e.target.checked)} />
                  <span>Puede eliminar usuarios</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" checked={form.canViewReports} onChange={(e) => handleChange('canViewReports', e.target.checked)} />
                  <span>Puede ver reportes</span>
                </label>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="button-group">
              <button className="btn btn-primary" type="submit">
                {editing ? '💾 Actualizar' : '➕ Crear Usuario'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                🔄 Limpiar
              </button>
            </div>
          </form>
        </div>
      )}

      {!isAdmin && (
        <div className="info-card">
          <p>ℹ️ Tienes permiso para ver usuarios. Solo los administradores pueden crear, editar o eliminar usuarios.</p>
        </div>
      )}

      <div className="card users-card">
        <h2>👥 Gestión de Usuarios ({users.length})</h2>
        {loading ? (
          <div className="loading">Cargando usuarios...</div>
        ) : users.length === 0 ? (
          <div className="empty-state">No hay usuarios registrados</div>
        ) : (
          <div className="table-wrapper">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Departamento</th>
                  <th>Teléfono</th>
                  <th>Permisos</th>
                  <th>Estado</th>
                  {isAdmin && <th>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="username">{u.username}</td>
                    <td>{u.email || '-'}</td>
                    <td>
                      <span className={`badge role-${u.role}`}>
                        {u.role === 'admin' ? '👑 Admin' : u.role === 'manager' ? '📊 Manager' : '👤 Usuario'}
                      </span>
                    </td>
                    <td>{u.department || '-'}</td>
                    <td>{u.phoneNumber || '-'}</td>
                    <td className="permissions-cell">
                      {u.canEditUsers && <span className="perm">✏️ Edit</span>}
                      {u.canDeleteUsers && <span className="perm">🗑️ Delete</span>}
                      {u.canViewReports && <span className="perm">📈 Reports</span>}
                      {!u.canEditUsers && !u.canDeleteUsers && !u.canViewReports && <span className="perm-none">-</span>}
                    </td>
                    <td>
                      <span className={`status ${u.isActive ? 'active' : 'inactive'}`}>
                        {u.isActive ? '✅ Activo' : '❌ Inactivo'}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="actions">
                        <button className="btn-icon edit" onClick={() => startEdit(u)} title="Editar">
                          ✏️
                        </button>
                        <button className="btn-icon delete" onClick={() => remove(u.id)} title="Eliminar">
                          🗑️
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
