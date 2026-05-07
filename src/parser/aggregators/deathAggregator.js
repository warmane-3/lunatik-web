export function aggregateDeaths(fight, event) {
  const { eventName, args } = event
  if (eventName !== 'UNIT_DIED') return

  const destName = args[4]?.replace(/"/g, '')
  const destGuid = args[3]

  if (!destName || !destGuid) return

  // Filter for players (heuristic: NPCs GUIDs usually start with 0xF)
  if (destGuid.startsWith('0xF')) return

  if (!fight.players[destName]) {
    fight.players[destName] = {
      damage: 0,
      healing: 0,
      deaths: 0,
      consumables: {}
    }
  }

  fight.players[destName].deaths += 1
  fight.deaths.push({
    player: destName,
    timestamp: event.timestamp
  })
}
