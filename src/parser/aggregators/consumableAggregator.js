const CONSUMABLE_IDS = {
  '47499': 'Flask of the Frost Wyrm',
  '47497': 'Flask of Endless Rage',
  '47498': 'Flask of Pure Mojo',
  '47496': 'Flask of Stoneblood',
  '57327': 'Fish Feast', // Well Fed
  '57325': 'Great Feast',
  '57139': 'Indestructible Potion',
  '53908': 'Potion of Speed',
  '53909': 'Potion of Wild Magic'
}

export function aggregateConsumables(fight, event) {
  const { eventName, args } = event
  if (eventName !== 'SPELL_AURA_APPLIED' && eventName !== 'SPELL_CAST_SUCCESS') return

  const destName = args[4]?.replace(/"/g, '')
  const spellId = args[6]
  
  if (!destName || !spellId) return

  if (CONSUMABLE_IDS[spellId]) {
    if (!fight.players[destName]) {
      fight.players[destName] = {
        damage: 0,
        healing: 0,
        deaths: 0,
        consumables: {}
      }
    }
    
    const consumableName = CONSUMABLE_IDS[spellId]
    fight.players[destName].consumables[consumableName] = (fight.players[destName].consumables[consumableName] || 0) + 1
  }
}
