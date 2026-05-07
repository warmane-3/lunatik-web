import bosses from './bosses.json'

const COMBAT_TIMEOUT = 15000 // 15 seconds

export function createFightDetector(onFightStart, onFightEnd) {
  let currentFight = null
  let lastActivity = 0

  function extractNpcId(guid) {
    if (!guid || !guid.startsWith('0xF')) return null
    // NPC GUID: 0xF1300079D100011B -> NPC ID is 79D1 (hex) -> 31185 (dec)
    // WotLK 3.3.5a Format: 0xF[Type][ID][Spawn]
    // The NPC ID is the 4-digit hex starting at index 8
    return parseInt(guid.substring(8, 12), 16).toString()
  }

  function processEvent(event) {
    const { timestamp, eventName, args } = event
    
    // Check for boss appearance/interaction
    const sourceGuid = args[0]
    const destGuid = args[3]
    const sourceNpcId = extractNpcId(sourceGuid)
    const destNpcId = extractNpcId(destGuid)

    const bossId = bosses[sourceNpcId] ? sourceNpcId : (bosses[destNpcId] ? destNpcId : null)

    if (bossId) {
      if (!currentFight) {
        // Start new fight
        currentFight = {
          boss: bosses[bossId],
          startTime: timestamp,
          lastActivity: timestamp,
          players: {},
          deaths: [],
          active: true
        }
        onFightStart(currentFight)
      } else if (currentFight.boss !== bosses[bossId]) {
        // Different boss encountered? End current and start new?
        // For simplicity, let's just update lastActivity if it's the same boss or 
        // handle multiple bosses later.
      }
    }

    if (currentFight) {
      // Any event updates activity? Let's say any damage/healing
      if (eventName.includes('DAMAGE') || eventName.includes('HEAL') || eventName === 'UNIT_DIED') {
        currentFight.lastActivity = timestamp
      }

      // Check for boss death
      if (eventName === 'UNIT_DIED' && (sourceNpcId === bossId || destNpcId === bossId)) {
        currentFight.result = 'kill'
        finalize(timestamp)
      }

      // Check for timeout (wipe/out of combat)
      // Re-check currentFight because finalize might have set it to null above
      if (currentFight && timestamp - currentFight.lastActivity > COMBAT_TIMEOUT) {
        currentFight.result = 'wipe'
        finalize(timestamp)
      }
    }

    lastActivity = timestamp
  }

  function finalize(timestamp) {
    if (currentFight) {
      currentFight.endTime = timestamp
      currentFight.durationMs = currentFight.endTime - currentFight.startTime
      currentFight.active = false
      onFightEnd(currentFight)
      currentFight = null
    }
  }

  return {
    processEvent,
    forceFinalize: () => finalize(lastActivity)
  }
}
