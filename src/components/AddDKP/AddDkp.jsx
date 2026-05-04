import { useState } from 'react'
import { useSelector } from 'react-redux'
import { API } from '../../views/Home/DkpsTable/DkpsTable.service'
import Swal from 'sweetalert2'
import './AddDkp.css'

const AddDkp = ({ setButtonShowAddDkp }) => {
  const [xmlData, setXmlData] = useState('')
  const [jsonData, setJsonData] = useState(false)
  const userData = useSelector((state) => state.user.userState.userData)

  const handleXmlChange = (e) => {
    setXmlData(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setJsonData(true)
    try {
      const response = await fetch(`${API}/dkps`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: xmlData, ...userData })
      })
      const result = await response.json()
      if (!result.error) {
        await Swal.fire({
          title: 'DKPs update successfull',
          icon: 'success',
          confirmButtonText: 'Continue',
          allowOutsideClick: false,
          didOpen: () => {
            // Seleccionar y modificar directamente los elementos
            const title = Swal.getTitle()
            const content = Swal.getHtmlContainer()
            if (title) title.style.fontSize = '18px'
            if (content) content.style.fontSize = '20px'
          },
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
        setJsonData(false)
        setXmlData('')
      } else {
        await Swal.fire({
          title: result.error,
          icon: 'error',
          confirmButtonText: 'Try again',
          allowOutsideClick: false,
          didOpen: () => {
            // Seleccionar y modificar directamente los elementos
            const title = Swal.getTitle()
            const content = Swal.getHtmlContainer()
            if (title) title.style.fontSize = '18px'
            if (content) content.style.fontSize = '20px'
          },
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
        setJsonData(false)
      }
    } catch (error) {
      await Swal.fire({
        title: 'Something went wrong',
        icon: 'error',
        confirmButtonText: 'Try again',
        allowOutsideClick: false,
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
      setJsonData(false)
    }
  }

  return (
    <div className='AddDkp'>
      <div className='add-dkp-form' onClick={(e) => e.stopPropagation()}>
        <h2>Update DKP</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className='add-dkp-textarea'
            value={xmlData}
            onChange={handleXmlChange}
            placeholder='Pega tu XML aquí'
          />
          {!jsonData ? (
            <button className='addDkp-button' type='submit'>
              Update Dkp
            </button>
          ) : (
            <button className='addDkp-button-loader' type='submit' disabled>
              <span className='addDkp-loader'></span>
            </button>
          )}
        </form>
        <button
          onClick={() => setButtonShowAddDkp(false)}
          className='addDkp-closed-button'
        >
          <div className='arrow'>
            <div className='line'></div>
            <div className='line'></div>
          </div>
        </button>
      </div>
    </div>
  )
}

export default AddDkp
