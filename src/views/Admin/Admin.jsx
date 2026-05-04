import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin
} from '../../redux/actions/actionsCharacters'
import Swal from 'sweetalert2'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import './Admin.css'

const Admin = () => {
  const dispatch = useDispatch()
  const userData = useSelector((state) => state.user.userState.userData)
  const { admins, loader } = useSelector((state) => state.players)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  })
  const [editingUsername, setEditingUsername] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    dispatch(getAdmins(userData))
  }, [dispatch, userData])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.username || !formData.password) {
      await Swal.fire({
        title: 'Error',
        text: 'Username y password son requeridos',
        icon: 'error',
        confirmButtonText: 'OK'
      })
      return
    }

    if (editingUsername) {
      const result = await dispatch(
        updateAdmin({
          username: editingUsername,
          updates: { password: formData.password, email: formData.email },
          userData
        })
      )
      if (result.payload?.error) {
        await Swal.fire({
          title: 'Error',
          text: result.payload.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else {
        await Swal.fire({
          title: 'Éxito',
          text: 'Administrador actualizado correctamente',
          icon: 'success',
          confirmButtonText: 'OK'
        })
        setEditingUsername(null)
        setFormData({ username: '', password: '', email: '' })
        dispatch(getAdmins(userData))
      }
    } else {
      const result = await dispatch(
        createAdmin({ newAdmin: formData, userData })
      )
      if (result.payload?.error) {
        await Swal.fire({
          title: 'Error',
          text: result.payload,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else {
        console.log(result.payload)

        await Swal.fire({
          title: 'Error',
          text: result.payload || 'Error al crear administrador',
          icon: 'error',
          confirmButtonText: 'OK'
        })
        setFormData({ username: '', password: '', email: '' })
        dispatch(getAdmins(userData))
      }
    }
  }

  const handleEdit = (admin) => {
    setEditingUsername(admin.username)
    setFormData({
      username: admin.username,
      password: '',
      email: admin.email || ''
    })
  }

  const handleCancelEdit = () => {
    setEditingUsername(null)
    setFormData({ username: '', password: '', email: '' })
  }

  const handleDelete = async (username) => {
    const result = await Swal.fire({
      title: `Eliminar ${username}?`,
      text: 'Esta acción no se puede deshacer.',
      input: 'text',
      inputPlaceholder: username,
      inputValidator: (value) => {
        if (value !== username) {
          return 'El nombre no coincide'
        }
      },
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    })

    if (result.isConfirmed) {
      const deleteResult = await dispatch(deleteAdmin({ username, userData }))
      if (deleteResult.payload?.error) {
        await Swal.fire({
          title: 'Error',
          text: deleteResult.payload.error,
          icon: 'error',
          confirmButtonText: 'OK'
        })
      } else {
        await Swal.fire({
          title: 'Éxito',
          text: deleteResult.payload?.message || 'Administrador eliminado',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      }
    }
  }

  return (
    <div className='admin-container'>
      <h1>Administración de Administradores</h1>

      <div className='admin-content'>
        <div className='admin-form-section'>
          <h2>
            {editingUsername ? 'Editar Administrador' : 'Crear Administrador'}
          </h2>
          <form onSubmit={handleSubmit} className='admin-form'>
            <div className='form-group'>
              <label htmlFor='username'>Username:</label>
              <input
                id='username'
                name='username'
                type='text'
                value={editingUsername || formData.username}
                onChange={handleInputChange}
                placeholder='Nombre de usuario'
                disabled={!!editingUsername}
                required={!editingUsername}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='password'>
                {editingUsername ? 'Nueva Contraseña:' : 'Password:'}
              </label>
              <div className='password-wrapper'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={
                    editingUsername ? 'Dejar vacío para no cambiar' : 'Contraseña'
                  }
                  required={!editingUsername}
                />
                <button
                  type='button'
                  className='password-toggle'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>
            <div className='form-group'>
              <label htmlFor='email'>Email:</label>
              <input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='Email del administrador'
              />
            </div>
            <div className='form-buttons'>
              <button type='submit' className='btn-submit' disabled={loader}>
                {loader
                  ? 'Procesando...'
                  : editingUsername
                    ? 'Actualizar'
                    : 'Crear'}
              </button>
              {editingUsername && (
                <button
                  type='button'
                  className='btn-cancel'
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div className='admin-list-section'>
          <h2>Lista de Administradores</h2>
          {loader ? (
            <div className='loader-container'>
              <span className='loader'></span>
            </div>
          ) : (
            <div className='admin-list'>
              {admins && admins.length > 0 ? (
                admins.map((admin) => (
                  <div key={admin.username} className='admin-item'>
                    <div className='admin-info'>
                      <span className='admin-username'>{admin.username}</span>
                      <span className='admin-email'>{admin.email}</span>
                    </div>
                    <div className='admin-actions'>
                      <button
                        className='btn-edit'
                        onClick={() => handleEdit(admin)}
                      >
                        Editar
                      </button>
                      <button
                        className='btn-delete'
                        onClick={() => handleDelete(admin.username)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className='no-data'>No hay administradores registrados.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
