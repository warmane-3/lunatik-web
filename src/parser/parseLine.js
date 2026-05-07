/**
 * High-performance WoW Combat Log line parser for WotLK 3.3.5a
 * Avoids Regex for speed.
 */
export function parseLine(line) {
  if (!line || line.length < 20) return null

  // Example: 5/2 21:45:27.910  SPELL_DAMAGE,...
  const firstSpace = line.indexOf(' ')
  
  // Find the event name (it's after the two spaces or after the last space before the first comma)
  const firstComma = line.indexOf(',')
  if (firstComma === -1) return null

  // The event name is between the timestamp and the first comma
  // Usually there are two spaces between time and event
  const eventStart = line.lastIndexOf(' ', firstComma) + 1
  const eventName = line.substring(eventStart, firstComma)
  
  // Approximate timestamp in ms (within the day)
  // We only need relative time for fight detection
  const timeStr = line.substring(firstSpace + 1, eventStart).trim()
  const timestamp = parseTimestamp(timeStr)

  // Split arguments by comma
  // Note: some names might contain commas? No, in WoW logs names are quoted if needed, 
  // but usually they don't contain commas. Actually, in 3.3.5a names are like "PlayerName".
  const args = line.substring(firstComma + 1).split(',')

  return {
    timestamp,
    eventName,
    args
  }
}

function parseTimestamp(timeStr) {
  // HH:MM:SS.msec
  const hours = parseInt(timeStr.substring(0, 2))
  const mins = parseInt(timeStr.substring(3, 5))
  const secs = parseInt(timeStr.substring(6, 8))
  const msecs = parseInt(timeStr.substring(9, 12))
  
  return (hours * 3600 + mins * 60 + secs) * 1000 + msecs
}
