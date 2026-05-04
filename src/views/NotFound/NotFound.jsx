import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className='notfound-container'>
      <div className='notfound-content'>
        <h1 className='notfound-code'>404</h1>
        <h2 className='notfound-title'>Página no encontrada</h2>
        <p className='notfound-text'>
          Lo sentimos, la página que buscas no existe.
        </p>
        <Link to='/' className='notfound-link'>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default NotFound