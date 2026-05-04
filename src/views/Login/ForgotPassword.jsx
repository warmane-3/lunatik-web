import { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API } from '../Home/DkpsTable/DkpsTable.service'
import Swal from 'sweetalert2'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import './ForgotPassword.css'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState(['', '', '', '', '', ''])
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const inputRefs = useRef([])

  const handleTokenChange = (index, value) => {
    const cleanedValue = value.replace(/\D/g, '').slice(-1)

    if (cleanedValue.length === 6 && index === 0) {
      const digits = cleanedValue.split('')
      const newToken = digits.slice(0, 6)
      setToken(newToken)
      inputRefs.current[5]?.focus()
      return
    }

    if (cleanedValue.length > 1) {
      const digits = cleanedValue.split('')
      const newToken = [...token]
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newToken[index + i] = digit
        }
      })
      setToken(newToken)
      const nextIndex = Math.min(index + digits.length, 5)
      inputRefs.current[nextIndex]?.focus()
      return
    }

    const newToken = [...token]
    newToken[index] = cleanedValue
    setToken(newToken)

    if (cleanedValue && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !token[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (pastedData.length > 0) {
      const digits = pastedData.split('')
      const newToken = [...token]
      digits.forEach((digit, i) => {
        if (i < 6) {
          newToken[i] = digit
        }
      })
      setToken(newToken)
      const focusIndex = Math.min(digits.length, 5)
      inputRefs.current[focusIndex]?.focus()
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const response = await fetch(`${API}/login/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const result = await response.json()
      if (!result.error) {
        await Swal.fire({
          title: 'Token enviado',
          text: 'Si el email existe, recibirás un token de 6 dígitos.',
          icon: 'success',
          confirmButtonText: 'Continuar',
          background: '#150529', // Púrpura muy oscuro para el fondo
          color: '#C77DFF', // Lavanda brillante para el texto principal
          confirmButtonColor: '#7B2CBF', // Púrpura vibrante para el botón
          backdrop: `
        rgba(5, 3, 14, 0.8)  /* Negro espacial con opacidad */
      `,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            confirmButton: 'custom-swal-confirm-button'
          }
        })
        setStep(2)
      } else {
        await Swal.fire({
          title: 'Error',
          text: result.error,
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#150529', // Púrpura muy oscuro para el fondo
          color: '#C77DFF', // Lavanda brillante para el texto principal
          confirmButtonColor: '#7B2CBF', // Púrpura vibrante para el botón
          backdrop: `
        rgba(5, 3, 14, 0.8)  /* Negro espacial con opacidad */
      `,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            confirmButton: 'custom-swal-confirm-button'
          }
        })
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo procesar la solicitud.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#150529', // Púrpura muy oscuro para el fondo
        color: '#C77DFF', // Lavanda brillante para el texto principal
        confirmButtonColor: '#7B2CBF', // Púrpura vibrante para el botón
        backdrop: `
        rgba(5, 3, 14, 0.8)  /* Negro espacial con opacidad */
      `,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          content: 'custom-swal-content',
          confirmButton: 'custom-swal-confirm-button'
        }
      })
    }
    setLoading(false)
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    const tokenString = token.join('')
    if (tokenString.length !== 6 || !newPassword) return
    setLoading(true)
    try {
      const response = await fetch(`${API}/login/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: tokenString, newPassword })
      })
      const result = await response.json()
      if (!result.error) {
        await Swal.fire({
          title: 'Contraseña actualizada',
          text: 'Tu contraseña ha sido cambiada exitosamente.',
          icon: 'success',
          confirmButtonText: 'Ir a login',
          background: '#150529', // Púrpura muy oscuro para el fondo
          color: '#C77DFF', // Lavanda brillante para el texto principal
          confirmButtonColor: '#7B2CBF', // Púrpura vibrante para el botón
          backdrop: `
        rgba(5, 3, 14, 0.8)  /* Negro espacial con opacidad */
      `,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            confirmButton: 'custom-swal-confirm-button'
          }
        })
        navigate('/login')
      } else {
        await Swal.fire({
          title: 'Error',
          text: result.error,
          icon: 'error',
          confirmButtonText: 'OK',
          background: '#150529', // Púrpura muy oscuro para el fondo
          color: '#C77DFF', // Lavanda brillante para el texto principal
          confirmButtonColor: '#7B2CBF', // Púrpura vibrante para el botón
          backdrop: `
        rgba(5, 3, 14, 0.8)  /* Negro espacial con opacidad */
      `,
          customClass: {
            popup: 'custom-swal-popup',
            title: 'custom-swal-title',
            content: 'custom-swal-content',
            confirmButton: 'custom-swal-confirm-button'
          }
        })
      }
    } catch (error) {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo procesar la solicitud.',
        icon: 'error',
        confirmButtonText: 'OK',
        background: '#150529', // Púrpura muy oscuro para el fondo
        color: '#C77DFF', // Lavanda brillante para el texto principal
        confirmButtonColor: '#7B2CBF', // Púrpura vibrante para el botón
        backdrop: `
        rgba(5, 3, 14, 0.8)  /* Negro espacial con opacidad */
      `,
        customClass: {
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          content: 'custom-swal-content',
          confirmButton: 'custom-swal-confirm-button'
        }
      })
    }
    setLoading(false)
  }

  return (
    <div className='forgot-password'>
      <form
        className='forgot-password-form'
        onSubmit={step === 1 ? handleEmailSubmit : handlePasswordChange}
      >
        <h2>{step === 1 ? 'Recuperar Contraseña' : 'Nueva Contraseña'}</h2>

        {step === 1 ? (
          <div className='forgot-password-input'>
            <label htmlFor='email'>Email:</label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Introduce tu email'
              required
            />
          </div>
        ) : (
          <>
            <div className='token-inputs-container'>
              <label>Token (6 dígitos):</label>
              <div className='token-inputs' onPaste={handlePaste}>
                {token.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleTokenChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className='token-input'
                    required
                  />
                ))}
              </div>
            </div>
            <div className='forgot-password-input'>
              <label htmlFor='newPassword'>Nueva Contraseña:</label>
              <div className='password-wrapper'>
                <input
                  id='newPassword'
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Nueva contraseña'
                  required
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
          </>
        )}

        <button
          type='submit'
          className='forgot-password-submit'
          disabled={loading}
        >
          {loading
            ? 'Procesando...'
            : step === 1
              ? 'Enviar Token'
              : 'Cambiar Contraseña'}
        </button>

        <Link to='/login' className='forgot-password-back'>
          Volver a Login
        </Link>
      </form>
    </div>
  )
}

export default ForgotPassword
