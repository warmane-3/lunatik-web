import { useEffect, useState } from 'react'
import { API } from '../../views/Home/DkpsTable/DkpsTable.service'
import './Login.css'
import { useNavigate } from 'react-router'
import { objectPost } from '../../helpers/objetPost'
import { MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../../redux/slice/sliceLogin'

const Login = ({ setShowAddDkp }) => {
  const [inputValue, setInputValue] = useState({
    user: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.userState.user)

  const onSubmitForm = async (e) => {
    e.preventDefault()
    const response = await fetch(`${API}/login`, objectPost(inputValue))
    const result = await response.json()
    if (result.response) {
      console.log('result.response', result.response)
      setShowAddDkp(result.response)
      dispatch(addUser(result.response))
      navigate('/')
    }
  }

  const handleOnChange = (e) => {
    if (e.target.id === 'user') {
      setInputValue({
        ...inputValue,
        user: e.target.value
      })
    } else {
      setInputValue({
        ...inputValue,
        password: e.target.value
      })
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  return (
    <div className='login'>
      <form className='login-form' onSubmit={onSubmitForm}>
        <h2>Iniciar Sesión</h2>
        <div className='login-input'>
          <label htmlFor='user'>User:</label>
          <input
            id='user'
            type='text'
            onChange={handleOnChange}
            placeholder='Introduce tu usuario'
          />
        </div>
        <div className='login-input'>
          <label htmlFor='password'>Password:</label>
          <div className='password-wrapper'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              onChange={handleOnChange}
              placeholder='Introduce tu contraseña'
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
        <button type='submit' className='login-submit'>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
