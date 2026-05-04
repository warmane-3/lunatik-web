import { useState } from 'react'
import './SearchPlayer.css'
import { useDispatch, useSelector } from 'react-redux'
import {
  getMainAndAlters,
  getFirst,
  getSecond
} from '../../redux/actions/actionsCharacters'

const SearchPlayer = ({
  players,
  alters,
  onPlayerClick,
  setButtonShowAddDkp
}) => {
  const [found, setFound] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [lastDays, setLastDays] = useState(false)
  const [listDays, setListDays] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const { date } = useSelector((state) => state.players)
  const user = useSelector((state) => state.user.userState.user)
  let hoursMin = ''
  let day = ''
  let month = ''
  if (date) {
    const [dateOne, dateTwo] = date.split(' ')
    hoursMin = dateTwo
    const [first, second] = dateOne.split('-')
    day = first
    month = second
  }

  const dispatch = useDispatch()

  const handleKeyDown = (e) => {
    if (found.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev < found.length - 1 ? prev + 1 : 0
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : found.length - 1
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && found[selectedIndex]) {
        onPlayerClick(found[selectedIndex].name)
        setInputValue('')
        setFound([])
        setSelectedIndex(-1)
      } else if (selectedIndex === -1) {
        onPlayerClick(found[0].name)
        setSelectedIndex(-1)
        setFound([])
        setInputValue('')
      }
    } else if (e.key === 'Escape') {
      setFound([])
      setSelectedIndex(-1)
    }
  }

  const find = (e) => {
    e.preventDefault()
    if (e.target.value.length <= 0) {
      setFound([])
      setInputValue(e.target.value)
      setSelectedIndex(-1)
      return
    }
    let primeraLetra = e.target.value.charAt(0).toUpperCase()
    let restoDelInput = e.target.value.slice(1)
    let resultado = players
      .filter((ele) => ele.name.startsWith(primeraLetra + restoDelInput))
      .slice(0, 10)

    const mainNamesSet = new Set(resultado.map((p) => p.name))

    if (alters && alters.length > 0) {
      const alterMatches = alters
        .filter((ele) => ele.name.startsWith(primeraLetra + restoDelInput))
        .map((alter) => alter.mainPlayername)
        .filter((mainName) => mainName && !mainNamesSet.has(mainName))
        .slice(0, 10 - resultado.length)

      alterMatches.forEach((mainName) => {
        const mainPlayer = players.find((p) => p.name === mainName)
        if (mainPlayer) {
          resultado.push(mainPlayer)
          mainNamesSet.add(mainName)
        }
      })
    }

    setFound(resultado)
    setInputValue(e.target.value)
    setSelectedIndex(-1)
  }

  const onSubmitForm = (e) => {
    e.preventDefault()
    if (found.length <= 0) {
      return
    }
    onPlayerClick(found[0].name)
    setInputValue('')
    setFound([])
    setSelectedIndex(-1)
  }

  const getDkps = (day) => {
    if (day === 'actual') {
      dispatch(getMainAndAlters())
    } else if (day === 'undia') {
      dispatch(getFirst())
    } else if (day === 'dosdias') {
      dispatch(getSecond())
    }
  }

  return (
    <div className='searchplayer-form-container mt-4'>
      <form className='searchplayer-form' onSubmit={onSubmitForm}>
        <div>
          <input
            value={inputValue}
            type='text'
            onChange={find}
            onKeyDown={handleKeyDown}
            placeholder='Buscar Personaje Main'
          />
          {found.length > 0 && (
            <div className='searchplayer-found'>
              {found.map((ele, i) => {
                return (
                  <h1
                    className={selectedIndex === i ? 'selected' : ''}
                    onMouseEnter={() => setSelectedIndex(i)}
                    onMouseLeave={() => setSelectedIndex(-1)}
                    onClick={(e) => {
                      e.stopPropagation()
                      onPlayerClick(ele.name)
                      setFound([])
                      setInputValue('')
                      setSelectedIndex(-1)
                    }}
                    key={i}
                    id={ele.name}
                  >
                    {ele.name}
                  </h1>
                )
              })}
            </div>
          )}
        </div>
        <button type='submit'>Buscar</button>
      </form>
      {user && (
        <div className='button-add-dkp-container'>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setButtonShowAddDkp(true)
            }}
            className='button-add-dkp'
          >
            Add Dkp
          </button>
        </div>
      )}
      <div
        className='date-container'
        onClick={(e) => {
          e.stopPropagation()
          setListDays(!listDays)
        }}
      >
        <div
          className='date'
          onMouseLeave={() => {
            setLastDays(false)
            setListDays(false)
          }}
          onMouseEnter={() => setLastDays(true)}
        >
          {lastDays ? (
            <h1 >Ver días anteriores</h1>
          ) : (
            <>
              <h1>Actualizacion: {`${day} de ${month} - ${hoursMin}`}</h1>
            </>
          )}
          {listDays && (
            <div className='list-days'>
              <button onClick={() => getDkps('actual')}>Actual</button>
              <button onClick={() => getDkps('undia')}>Hace 1 día</button>
              <button onClick={() => getDkps('dosdias')}>Hace 2 días</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchPlayer
