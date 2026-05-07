import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getFightById } from '../../redux/actions/actionsLogs'
import { selectColor } from '../Home/DkpsTable/DkpsTable.service'

const FightDetail = () => {
  const { fightId } = useParams()
  const dispatch = useDispatch()
  const { currentFight, loading } = useSelector((state) => state.logs)
  const [tab, setTab] = useState('damage')

  useEffect(() => {
    dispatch(getFightById(fightId))
  }, [dispatch, fightId])

  if (!currentFight && loading) {
    return (
      <div className='flex justify-center p-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!currentFight) return <div className='p-6 text-white'>Fight not found.</div>

  const players = [...(currentFight.fight_players || [])]
  
  // Sorting players based on current tab
  const sortedPlayers = players.sort((a, b) => {
    if (tab === 'damage') return b.damage - a.damage
    if (tab === 'healing') return b.healing - a.healing
    return 0
  })

  const maxVal = tab === 'damage' 
    ? Math.max(...players.map(p => p.damage), 1)
    : Math.max(...players.map(p => p.healing), 1)

  return (
    <div className='fight-detail-container p-6 text-white max-w-7xl mx-auto'>
      <div className='mb-8'>
        <Link to={`/logs/${currentFight.logId}`} className='text-accent-cyan hover:underline mb-4 inline-block'>&larr; Back to Session</Link>
        <div className='flex justify-between items-end'>
          <div>
            <h1 className='text-4xl font-bold text-white'>{currentFight.boss}</h1>
            <p className='text-text-secondary'>
              Result: <span className={currentFight.result === 'kill' ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>{currentFight.result.toUpperCase()}</span> • 
              Duration: {(currentFight.durationMs / 1000 / 60).toFixed(1)}m
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='flex gap-4 mb-6 border-b border-border-color'>
        <button
          onClick={() => setTab('damage')}
          className={`pb-2 px-4 font-bold transition-all ${tab === 'damage' ? 'text-primary border-b-2 border-primary' : 'text-text-muted hover:text-white'}`}
        >
          DAMAGE
        </button>
        <button
          onClick={() => setTab('healing')}
          className={`pb-2 px-4 font-bold transition-all ${tab === 'healing' ? 'text-green-400 border-b-2 border-green-400' : 'text-text-muted hover:text-white'}`}
        >
          HEALING
        </button>
      </div>

      {/* Rankings */}
      <div className='rankings-list flex flex-col gap-2'>
        {sortedPlayers.filter(p => (tab === 'damage' ? p.damage > 0 : p.healing > 0)).map((player, idx) => {
          const val = tab === 'damage' ? player.damage : player.healing
          const percentOfMax = (val / maxVal) * 100
          const classColor = selectColor(player.characterClass) || '#ffffff'

          return (
            <div key={player.id} className='relative h-10 flex items-center bg-surface-dark/30 rounded overflow-hidden'>
              {/* Progress Bar Background */}
              <div 
                className='absolute left-0 top-0 h-full opacity-40 transition-all duration-1000'
                style={{ 
                  width: `${percentOfMax}%`, 
                  backgroundColor: classColor 
                }}
              ></div>
              
              {/* Content */}
              <div className='relative w-full px-4 flex justify-between items-center z-10'>
                <div className='flex gap-3 items-center'>
                  <span className='text-xs text-text-muted w-4'>{idx + 1}</span>
                  <span className='font-bold' style={{ color: classColor }}>{player.name}</span>
                </div>
                <div className='flex gap-6 text-sm'>
                  <span className='font-medium'>{val.toLocaleString()}</span>
                  <span className='text-text-secondary w-20 text-right'>
                    {tab === 'damage' ? `${player.dps.toLocaleString()} DPS` : `${player.hps.toLocaleString()} HPS`}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Deaths and Consumables sections could go here */}
    </div>
  )
}

export default FightDetail
