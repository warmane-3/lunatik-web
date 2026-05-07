export function aggregateHealing(fight, event) {
  const { eventName, args } = event
  const sourceName = args[1]?.replace(/"/g, '')
  if (!sourceName) return

  let amount = 0
  let overheal = 0

  if (eventName === 'SPELL_HEAL' || eventName === 'SPELL_PERIODIC_HEAL') {
    amount = parseInt(args[9]) || 0
    overheal = parseInt(args[10]) || 0
  }

  const effectiveHealing = amount - overheal

  if (effectiveHealing > 0) {
    if (!fight.players[sourceName]) {
      fight.players[sourceName] = {
        damage: 0,
        healing: 0,
        deaths: 0,
        consumables: {}
      }
    }
    fight.players[sourceName].healing += effectiveHealing
  }
}
