import { memo, useState, useMemo } from 'react'
import lootData from '../../../data/item_bis.json'
import {
  FaSkull,
  FaInfoCircle,
  FaTrophy,
  FaLayerGroup,
  FaSearch,
  FaFilter,
  FaTimes
} from 'react-icons/fa'
import './LootTable.css'

const LootTable = memo(() => {
  const [selectedRaid, setSelectedRaid] = useState(lootData[0].raid)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBoss, setSelectedBoss] = useState('ALL')
  const [selectedClass, setSelectedClass] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')

  const raids = useMemo(() => lootData.map((r) => r.raid), [])

  const currentRaidData = useMemo(
    () => lootData.find((r) => r.raid === selectedRaid),
    [selectedRaid]
  )

  const formatName = (name) => {
    if (!name) return ''
    return name
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Get unique lists for filters based on current raid
  const filterOptions = useMemo(() => {
    const bosses = currentRaidData.bosses.map((b) => b.name)
    const classes = new Set()
    const priorities = new Set()

    currentRaidData.bosses.forEach((boss) => {
      boss.items?.forEach((item) => {
        item.classes?.forEach((cls) => classes.add(cls))
        if (item.priority) priorities.add(item.priority)
      })
    })

    return {
      bosses: bosses.sort(),
      classes: Array.from(classes).sort(),
      priorities: Array.from(priorities).sort()
    }
  }, [currentRaidData])

  // Main filtering logic
  const filteredBosses = useMemo(() => {
    return currentRaidData.bosses
      .map((boss) => {
        // Filter by Boss Name first
        if (selectedBoss !== 'ALL' && boss.name !== selectedBoss) return null

        // Filter items within the boss
        const filteredItems =
          boss.items?.filter((item) => {
            const matchesSearch = item.item
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase())
            const matchesClass =
              selectedClass === 'ALL' ||
              item.classes?.includes(selectedClass) ||
              (selectedClass === 'TANK' && item.classes?.includes('TANK')) // Simple handling for TANK/MELEE groups
            const matchesPriority =
              selectedPriority === 'ALL' || item.priority === selectedPriority

            return matchesSearch && matchesClass && matchesPriority
          }) || []

        // If no items match and we are searching/filtering, hide the boss
        if (
          filteredItems.length === 0 &&
          (searchTerm || selectedClass !== 'ALL' || selectedPriority !== 'ALL')
        ) {
          return null
        }

        return { ...boss, items: filteredItems }
      })
      .filter(Boolean)
  }, [
    currentRaidData,
    searchTerm,
    selectedBoss,
    selectedClass,
    selectedPriority
  ])

  const resetFilters = () => {
    setSearchTerm('')
    setSelectedBoss('ALL')
    setSelectedClass('ALL')
    setSelectedPriority('ALL')
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'BIS':
        return '#a855f7'
      case 'PRIORITY':
        return '#22d3ee'
      case 'CONDITIONAL':
        return '#fcd34d'
      case 'NON_BIS':
        return '#94a3b8'
      case 'IGNORE':
        return '#ef4444'
      default:
        return '#f8fafc'
    }
  }

  return (
    <div className='LootTable-container'>
      <div className='LootTable-content'>
        {/* Header */}
        <section className='loottable-header backdrop-blur-md'>
          <div className='flex justify-center mb-4'>
            <FaLayerGroup size={50} className='text-accent-cyan' />
          </div>
          <h1>LOOT-LIST</h1>

          <div className='raid-selector mb-8'>
            {raids.map((raid) => (
              <button
                key={raid}
                className={`raid-btn ${selectedRaid === raid ? 'active' : ''}`}
                onClick={() => {
                  setSelectedRaid(raid)
                  resetFilters()
                }}
              >
                {formatName(raid)}
              </button>
            ))}
          </div>

          {/* Filters Bar */}
          <div className='filters-bar backdrop-blur-sm'>
            <div className='filter-group search-input'>
              <FaSearch className='filter-icon' />
              <input
                type='text'
                placeholder='Buscar item...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className='filter-group'>
              <FaSkull className='filter-icon' />
              <select
                className='rounded-md'
                value={selectedBoss}
                onChange={(e) => setSelectedBoss(e.target.value)}
              >
                <option value='ALL'>Todos los Bosses</option>
                {filterOptions.bosses.map((b) => (
                  <option key={b} value={b}>
                    {formatName(b)}
                  </option>
                ))}
              </select>
            </div>

            <div className='filter-group'>
              <FaFilter className='filter-icon' />
              <select
                className='rounded-md'
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value='ALL'>Todas las Clases</option>
                {filterOptions.classes.map((c) => (
                  <option key={c} value={c}>
                    {formatName(c)}
                  </option>
                ))}
              </select>
            </div>

            <div className='filter-group'>
              <FaTrophy className='filter-icon' />
              <select
                className='rounded-md'
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value='ALL'>Todas las Prioridades</option>
                {filterOptions.priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            {(searchTerm ||
              selectedBoss !== 'ALL' ||
              selectedClass !== 'ALL' ||
              selectedPriority !== 'ALL') && (
              <button
                className='reset-filters-btn'
                onClick={resetFilters}
                title='Limpiar filtros'
              >
                <FaTimes />
              </button>
            )}
          </div>
        </section>

        {/* Bosses List */}
        <div className='bosses-container'>
          {filteredBosses.length > 0 ? (
            filteredBosses.map((boss, index) => (
              <section key={index} className='boss-section backdrop-blur-sm'>
                <div className='boss-header'>
                  <FaSkull className='boss-icon' />
                  <h2>{formatName(boss.name)}</h2>
                </div>

                <div className='items-table-wrapper'>
                  <table className='items-table'>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Clases</th>
                        <th className='text-center'>Prioridad</th>
                        <th>Comentario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boss.items.map((item, itemIdx) => (
                        <tr key={itemIdx}>
                          <td className='item-name'>
                            <div className='flex items-center gap-2'>
                              <FaTrophy className='text-accent-cyan shrink-0' />
                              <span>{item.item}</span>
                            </div>
                          </td>
                          <td className='item-classes'>
                            {item.classes && item.classes.length > 0 ? (
                              <div className='classes-tags'>
                                {item.classes.map((cls, idx) => (
                                  <span key={idx} className='class-tag'>
                                    {formatName(cls)}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className='text-muted italic text-xs'>
                                Universal / Ver nota
                              </span>
                            )}
                          </td>
                          <td className='item-priority'>
                            <div className='flex justify-center'>
                              <span
                                className='priority-badge'
                                style={{
                                  backgroundColor: `${getPriorityColor(item.priority)}15`,
                                  color: getPriorityColor(item.priority),
                                  borderColor: `${getPriorityColor(item.priority)}50`
                                }}
                              >
                                {item.priority || 'NORMAL'}
                              </span>
                            </div>
                          </td>
                          <td className='item-comment'>
                            {item.comment ? (
                              <div className='comment-text'>
                                <FaInfoCircle className='inline mr-1 opacity-60 text-xs' />
                                {item.comment}
                              </div>
                            ) : (
                              '-'
                            )}
                            {item.target && (
                              <div className='target-info mt-1'>
                                <span className='text-accent-cyan font-bold'>
                                  Target:
                                </span>{' '}
                                {formatName(item.target)}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))
          ) : (
            <div className='no-results-msg backdrop-blur-md'>
              <FaSearch size={40} className='mb-4 opacity-20' />
              <h3>No se encontraron coincidencias</h3>
              <p>Prueba ajustando los filtros o buscando otro término.</p>
              <button
                onClick={resetFilters}
                className='mt-4 text-accent-cyan underline underline-offset-4 hover:text-white transition-colors'
              >
                Limpiar todos los filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

LootTable.displayName = 'LootTable'

export default LootTable
