export function aggregateDamage(fight, event) {
  const { eventName, args } = event
  const sourceName = args[1]?.replace(/"/g, '')
  if (!sourceName) return

  let amount = 0
  if (eventName === 'SWING_DAMAGE') {
    amount = parseInt(args[6]) || 0
  } else if (eventName === 'SPELL_DAMAGE' || eventName === 'RANGE_DAMAGE' || eventName === 'SPELL_PERIODIC_DAMAGE') {
    amount = parseInt(args[9]) || 0
  }

  if (amount > 0) {
    if (!fight.players[sourceName]) {
      fight.players[sourceName] = createPlayerEntry()
    }
    fight.players[sourceName].damage += amount
  }
}

function createPlayerEntry() {
  return {
    damage: 0,
    healing: 0,
    deaths: 0,
    consumables: {}
  }
}
