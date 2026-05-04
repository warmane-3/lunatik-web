import { useState, useCallback, useEffect, useRef, memo } from 'react'
import { selectColor } from '../DkpsTable.service'
import { useDispatch, useSelector } from 'react-redux'
import { deleteCharacter } from '../../../../redux/actions/actionsCharacters'
import Swal from 'sweetalert2'
import './RowPlayer.css'

const RowPlayer = ({
  ele,
  i,
  playerRefs,
  greenColor,
  setGreenColor,
  state,
  onPlayerClick
}) => {
  const [color, setColor] = useState(i % 2 !== 0 ? '#86868623' : '')
  const greenColorTimeoutRef = useRef(null)
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.userState.user)

  const handleDelete = useCallback(async (e) => {
    e.stopPropagation()
    const result = await Swal.fire({
      title: `Eliminar ${ele.name}?`,
      text: 'Esto eliminará el personaje y todos sus alters.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33'
    })
    if (result.isConfirmed) {
      dispatch(deleteCharacter(ele.name))
    }
  }, [dispatch, ele.name])

  // Cleanup green color timeout on unmount
  useEffect(() => {
    return () => {
      if (greenColorTimeoutRef.current) {
        clearTimeout(greenColorTimeoutRef.current)
      }
    }
  }, [])

  // Cleanup refs on unmount
  useEffect(() => {
    const playerName = ele.name
    const current = playerRefs.current
    return () => {
      if (current[playerName]) {
        delete current[playerName]
      }
    }
  }, [ele.name, playerRefs])

  const handleRowColorChange = useCallback(
    (isHovering) => {
      if (isHovering) {
        setColor('#A855F733')
      } else {
        setColor(i % 2 !== 0 ? '#86868623' : '')
      }
    },
    [i]
  )

  const handlePlayerClick = useCallback(() => {
    // Filter alters for this player
    const playerAlters = state.filter((eleAlter) => {
      return ele.name === eleAlter.mainPlayername
    })
    onPlayerClick({
      player: ele,
      alters: playerAlters
    })
  }, [ele, state, onPlayerClick])

  const getBackgroundColor = useCallback(() => {
    if (greenColor === ele.name) {
      greenColorTimeoutRef.current = setTimeout(() => {
        setGreenColor('')
      }, 3000)
      return '#5a459f'
    }
    return color
  }, [greenColor, ele.name, color, setGreenColor])

  return (
    <div
      ref={(el) => (playerRefs.current[ele.name] = el)}
      style={{
        backgroundColor: getBackgroundColor(),
        transition: 'all 0.3s ease'
      }}
      className='player'
      id={ele.name}
      onClick={(e) => {
        e.stopPropagation()
        handlePlayerClick()
      }}
      onMouseEnter={() => handleRowColorChange(true)}
      onMouseLeave={() => handleRowColorChange(false)}
      role='button'
      tabIndex={0}
    >
      <h1 style={{ color: selectColor(ele.class, ele) }}>
        {ele.name}
        {user && (
          <button
            className='delete-player-btn'
            onClick={handleDelete}
            title='Eliminar personaje y alters'
          >
            ×
          </button>
        )}
      </h1>
      <h1 style={{ color: selectColor(ele.class) }}>{ele.class}</h1>
      <h1 style={{ color: selectColor(ele.class) }}>{ele.rank}</h1>
      <h1 style={{ color: selectColor(ele.class) }}>{ele.net}</h1>
    </div>
  )
}

const MemoizedRowPlayer = memo(RowPlayer)
export default MemoizedRowPlayer
