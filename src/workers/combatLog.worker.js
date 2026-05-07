import { parseLine } from '../parser/parseLine'
import { createFightDetector } from '../parser/fightDetector'
import { aggregateDamage } from '../parser/aggregators/damageAggregator'
import { aggregateHealing } from '../parser/aggregators/healingAggregator'
import { aggregateDeaths } from '../parser/aggregators/deathAggregator'
import { aggregateConsumables } from '../parser/aggregators/consumableAggregator'

const CHUNK_SIZE = 4 * 1024 * 1024 // 4MB

self.onmessage = async (e) => {
  const { file } = e.data
  if (!file) return

  const totalSize = file.size
  let offset = 0
  let leftover = ''
  let fights = []
  let currentFight = null
  let detectedPlayers = new Set()
  let linesProcessed = 0

  const fightDetector = createFightDetector(
    (startedFight) => {
      currentFight = startedFight
    },
    (endedFight) => {
      fights.push(endedFight)
      currentFight = null
    }
  )

  const startTime = performance.now()

  while (offset < totalSize) {
    const chunk = file.slice(offset, offset + CHUNK_SIZE)
    const text = await chunk.text()
    const combined = leftover + text
    const lines = combined.split('\n')
    
    // Save last line if it's incomplete
    leftover = lines.pop()

    for (const line of lines) {
      linesProcessed++
      if (!line.trim()) continue
      
      const event = parseLine(line)
      if (!event) continue

      // Capture player names from events (source is usually index 1)
      const sourceName = event.args[1]?.replace(/"/g, '')
      const sourceGuid = event.args[0]
      if (sourceName && sourceGuid && !sourceGuid.startsWith('0xF')) {
        detectedPlayers.add(sourceName)
      }

      fightDetector.processEvent(event)

      // Only aggregate if we are in a fight
      if (currentFight) {
        aggregateDamage(currentFight, event)
        aggregateHealing(currentFight, event)
        aggregateDeaths(currentFight, event)
        aggregateConsumables(currentFight, event)
      }
    }

    offset += CHUNK_SIZE
    
    // Report progress
    self.postMessage({
      type: 'PROGRESS',
      payload: {
        processed: Math.min(offset, totalSize),
        total: totalSize,
        fightsCount: fights.length + (currentFight ? 1 : 0),
        linesProcessed,
        playersCount: detectedPlayers.size
      }
    })
  }

  fightDetector.forceFinalize()

  const endTime = performance.now()
  const duration = (endTime - startTime) / 1000

  self.postMessage({
    type: 'COMPLETE',
    payload: {
      fights,
      duration,
      originalSize: totalSize,
      linesProcessed,
      detectedPlayers: Array.from(detectedPlayers)
    }
  })
}
