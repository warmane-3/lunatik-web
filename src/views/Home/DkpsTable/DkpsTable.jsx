import { useEffect, useState, useRef } from 'react'
import { header, rankPriority } from './DkpsTable.service'
import './DkpsTable.css'
import './DkpsTable.header.css'
import SearchPlayer from '../../../components/search/SearchPlayer'
import RowPlayer from './RowPlayer/RowPlayer'
import { useDispatch, useSelector } from 'react-redux'
import { getMainAndAlters } from '../../../redux/actions/actionsCharacters'

const DkpsTable = ({ showAddDKP, setButtonShowAddDkp, onPlayerSelect }) => {
  // const [jsonData] = useState([])
  const [renderData, setRenderData] = useState([])
  // const [loader, setLoader] = useState(false)
  const [greenColor, setGreenColor] = useState('')
  const playerRefs = useRef({})
  const hasInitialized = useRef(false)
  const dispatch = useDispatch()
  const { alters, mains, loader } = useSelector((state) => state.players)

  useEffect(() => {
    setRenderData(mains)
  }, [mains])

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true
      dispatch(getMainAndAlters())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ordena por Clase
  const classOrder = () => {
    console.log('mains 123', mains)

    if (mains === undefined || !mains.length) {
      return []
    }
    const order = [...mains]
    const classMap = {
      Warlock: [],
      'Death Knight': [],
      Hunter: [],
      Shaman: [],
      Druid: [],
      Warrior: [],
      Mage: [],
      Paladin: [],
      Rogue: [],
      Priest: []
    }

    order.forEach((ele) => {
      if (classMap[ele.class]) {
        classMap[ele.class].push(ele)
      }
    })

    const array = []

    for (let ele in classMap) {
      array.push(classMap[ele].sort((a, b) => a.name.localeCompare(b.name)))
    }
    const newOrderMain = array.flat()
    return newOrderMain
  }

  // Ordena por Nombre
  const nameOrder = () => {
    console.log('mains 123', mains)

    if (mains === undefined || !mains.length) {
      return []
    }
    const order = [...mains]
    const newORderMain = order.sort((a, b) => a.name.localeCompare(b.name))
    return newORderMain
  }

  // Ordena por Rango
  const rankOrder = () => {
    if (mains === undefined || !mains.length) {
      return []
    }
    const newORderMain = [...mains].sort(
      (a, b) => rankPriority[a.rank] - rankPriority[b.rank]
    )
    return newORderMain
  }

  const dkpsOrder = () => {
    console.log('mains 123', mains)

    if (mains === undefined || !mains.length) {
      return []
    }
    const order = [...mains]
    const newORderMain = order.sort((a, b) => b.net - a.net)
    return newORderMain
  }

  // Selecciona el Orden por Rango, Nombre o Clase!
  const order = (e) => {
    e.preventDefault()
    const buttonId = e.target.id || e.target.parentElement.id
    if (buttonId === 'Clase') {
      setRenderData(classOrder())
    } else if (buttonId === 'Personaje') {
      setRenderData(nameOrder())
    } else if (buttonId === 'Rango') {
      setRenderData(rankOrder())
    } else if (buttonId === 'Dkps') {
      setRenderData(dkpsOrder())
    }
  }

  const scrollToPlayer = (name) => {
    setGreenColor(name)
    playerRefs.current[name]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }

  return (
    <div className='DkpsTable'>
      <SearchPlayer
        setButtonShowAddDkp={setButtonShowAddDkp}
        showAddDKP={showAddDKP}
        players={mains}
        onPlayerClick={scrollToPlayer}
        setRenderData={setRenderData}
      />
      <div className='header'>
        {header.map((ele, i) => {
          return (
            <button
              id={ele}
              onClick={order}
              key={i}
              className={`header-button ${
                renderData ===
                (ele === 'Clase'
                  ? classOrder()
                  : ele === 'Personaje'
                    ? nameOrder()
                    : ele === 'Rango'
                      ? rankOrder()
                      : ele === 'Dkps'
                        ? dkpsOrder()
                        : '')
                  ? 'active'
                  : ''
              }`}
            >
              <h1 key={i}>{ele}</h1>
            </button>
          )
        })}
      </div>
      {loader ? (
        <div className='loader-container'>
          <span className='loader'></span>
        </div>
      ) : renderData?.length > 0 ? (
        <div className='all-players'>
          {renderData.map((ele, i) => {
            return (
              <RowPlayer
                state={alters}
                key={i}
                ele={ele}
                i={i}
                playerRefs={playerRefs}
                greenColor={greenColor}
                setGreenColor={setGreenColor}
                onPlayerClick={onPlayerSelect}
              />
            )
          })}
        </div>
      ) : (
        <div className='no-data-placeholder'>
          <p className='primary-text'>No se encontraron personajes</p>
          <p className='secondary-text'>
            La lista de campeones está actualmente vacía.
          </p>
        </div>
      )}
    </div>
  )
}

export default DkpsTable
