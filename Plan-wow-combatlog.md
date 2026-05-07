# Plan de Implementación — Parser de WoW Combat Log (WotLK 3.3.5a)

## Objetivo

Crear una página dentro del proyecto existente que permita:

1. Seleccionar un archivo `WoWCombatLog.txt`
2. Analizar superficialmente el archivo:
   - tamaño
   - caracteres aproximados
   - cantidad de chunks
   - tiempo estimado

3. Procesar el archivo completamente en el navegador
4. Generar un JSON resumido de las peleas
5. Enviar el JSON resumido al backend Express
6. Mostrar los resultados en pantalla

---

# Arquitectura General

```txt
Usuario selecciona archivo
        ↓
Frontend (React/Vite)
        ↓
Web Worker
        ↓
Chunk Reader
        ↓
Combat Log Parser
        ↓
Fight Segmentation
        ↓
Aggregators
        ↓
JSON resumido
        ↓
Upload al backend Express
        ↓
Visualización de peleas
```

---

# Decisiones Técnicas

## Procesamiento en frontend

El procesamiento debe ocurrir completamente en el navegador porque:

- Render Free Plan tiene recursos limitados
- Parsear 300MB server-side puede provocar:
  - timeouts
  - consumo excesivo de RAM
  - bloqueo del backend

- El usuario ya posee el archivo localmente
- Solo se necesita enviar un JSON resumido

---

# Stack recomendado

## Frontend

- React.js
- Vite
- Web Workers
- Zustand o Redux Toolkit (opcional)

## Backend

- Express.js
- PostgreSQL

---

# Página Principal

## Ruta

```txt
/logs/upload
```

---

# Flujo UX

## Paso 1 — Selección de archivo

### UI

```txt
[ Seleccionar WoWCombatLog.txt ]
```

---

## Paso 2 — Análisis superficial

El frontend debe leer:

- tamaño del archivo
- tamaño aproximado en caracteres
- cantidad estimada de líneas
- cantidad de chunks
- ETA aproximado

### Ejemplo UI

```txt
Archivo: WoWCombatLog.txt
Tamaño: 302 MB
Caracteres aprox: 321,442,112
Chunks: 76
Chunk Size: 4MB
Tiempo estimado: 28 segundos
```

---

## Paso 3 — Procesamiento

### UI en tiempo real

```txt
Procesado: 142MB / 302MB
Velocidad: 8.2MB/s
ETA: 18s
Peleas detectadas: 11
```

### Progress bar

```txt
██████████░░░░░░░░ 54%
```

---

## Paso 4 — Preview

### UI

```txt
Sindragosa - Kill - 6:12
The Lich King - Wipe - 4:02
Blood Queen Lana'thel - Kill - 3:51
```

---

## Paso 5 — Upload

### UI

```txt
Subiendo JSON resumido...
Upload completado.
```

---

# Estructura del Frontend

## Carpetas recomendadas

```txt
src/
 ├── pages/
 │    └── UploadLogPage.jsx
 │
 ├── workers/
 │    └── combatLog.worker.js
 │
 ├── parser/
 │    ├── parseLine.js
 │    ├── chunkReader.js
 │    ├── eventDispatcher.js
 │    ├── fightDetector.js
 │    ├── aggregators/
 │    │    ├── damageAggregator.js
 │    │    ├── healAggregator.js
 │    │    ├── deathAggregator.js
 │    │    └── consumableAggregator.js
 │    │
 │    └── bosses.json
 │
 └── services/
      └── uploadLog.js
```

---

# Web Worker

## Motivo

Procesar 300MB en el main thread congelará React y la UI.

Por eso el parsing debe ejecutarse en un Worker.

---

# Flujo del Worker

```txt
Main Thread
   ↓
Worker
   ↓
Read chunk
   ↓
Parse lines
   ↓
Update aggregators
   ↓
Fight segmentation
   ↓
Emit progress
   ↓
Return final JSON
```

---

# Lectura por Chunks

## NO HACER

```js
const text = await file.text()
```

Problemas:

- consumo enorme de memoria
- congelamiento
- duplicación de strings

---

## HACER

```js
const chunk = file.slice(start, end)
```

---

# Tamaño recomendado del chunk

## Inicial

```txt
4MB
```

Balance razonable entre:

- RAM
- velocidad
- overhead

---

# Problema de líneas cortadas

Los chunks pueden terminar así:

```txt
SPELL_AURA_AP
```

Y continuar en el siguiente:

```txt
PLIED,...
```

Por eso debe existir un buffer temporal.

---

# Ejemplo de lógica

```js
let leftover = ''

function processChunk(text) {
  const combined = leftover + text

  const lines = combined.split('\n')

  leftover = lines.pop()

  for (const line of lines) {
    parseLine(line)
  }
}
```

---

# Parser

# Objetivo

NO parsear todo.

Solo los datos necesarios.

---

# Eventos importantes

## Damage

```txt
SPELL_DAMAGE
SWING_DAMAGE
RANGE_DAMAGE
```

---

## Healing

```txt
SPELL_HEAL
SPELL_PERIODIC_HEAL
```

---

## Deaths

```txt
UNIT_DIED
```

---

## Consumables

```txt
SPELL_AURA_APPLIED
```

Solo whitelist:

- Flask
- Food
- Potion

---

# Eventos que pueden ignorarse inicialmente

```txt
SPELL_CAST_FAILED
SPELL_AURA_REFRESH
ENVIRONMENTAL_DAMAGE
SPELL_ENERGIZE
```

---

# Ejemplo de línea

```txt
5/2 21:45:27.910 SPELL_AURA_APPLIED,...
```

---

# Parseo recomendado

## Evitar regex complejas

Regex grandes sobre 300MB pueden destruir el rendimiento.

---

# Mejor enfoque

Parser manual usando:

```js
indexOf()
substring()
```

---

# Ejemplo simplificado

```js
function parseLine(line) {
  const firstComma = line.indexOf(',')

  const timestamp = line.substring(0, firstComma)

  const secondComma = line.indexOf(',', firstComma + 1)

  const eventType = line.substring(firstComma + 1, secondComma)

  return {
    timestamp,
    eventType
  }
}
```

---

# Fight Detection

# Importante

WotLK 3.3.5a muchas veces NO contiene:

```txt
ENCOUNTER_START
ENCOUNTER_END
```

Por eso la pelea debe reconstruirse heurísticamente.

---

# Estrategia recomendada

## Inicio de pelea

Cuando:

- aparece un boss conocido
- o la raid hace daño al boss

---

## Fin de pelea

Cuando:

- boss muere
- o pasan 15 segundos sin actividad relevante

---

# Boss Database

Archivo:

```txt
bosses.json
```

Ejemplo:

```json
{
  "36853": "Sindragosa",
  "36597": "The Lich King"
}
```

---

# Extracción de NPC ID

## GUID ejemplo

```txt
0xF1300079D100011B
```

Debe existir una función:

```js
extractNpcId(guid)
```

---

# Estado interno de pelea

```js
const currentFight = {
  active: false,
  boss: null,
  startTime: null,
  lastActivity: null,
  result: null
}
```

---

# Timeout de pelea

```js
const COMBAT_TIMEOUT = 15000
```

---

# Ejemplo de lógica

```js
if (
  currentFight.active &&
  timestamp - currentFight.lastActivity > COMBAT_TIMEOUT
) {
  finalizeFight()
}
```

---

# Aggregators

# Importante

NO guardar todos los eventos.

---

# Incorrecto

```js
allEvents.push(event)
```

---

# Correcto

```js
damage[player] += amount
```

---

# Damage Aggregator

## Estructura

```js
const damage = {
  Tuskal: {
    total: 5234234,
    spells: {
      Fireball: 234234,
      Pyroblast: 843234
    }
  }
}
```

---

# Healing Aggregator

```js
const healing = {
  PriestOne: {
    total: 3423423
  }
}
```

---

# Death Aggregator

```js
const deaths = [
  {
    player: 'Tuskal',
    timestamp: 123456,
    spell: 'Frost Breath'
  }
]
```

---

# Consumable Aggregator

## Detectar

- Flask
- Food
- Potions

---

# Ejemplo

```js
const consumables = {
  Tuskal: {
    flask: 'Flask of the Frost Wyrm',
    food: 'Fish Feast'
  }
}
```

---

# Top Rankings

## DPS

```js
const dps = totalDamage / duration
```

---

## HPS

```js
const hps = totalHealing / duration
```

---

# JSON Final

# Objetivo

Reducir:

```txt
300MB raw
↓
200KB–2MB resumido
```

---

# Estructura recomendada

```json
{
  "logInfo": {
    "uploadedAt": "2026-05-06",
    "originalSize": 302000000
  },
  "fights": [
    {
      "boss": "Sindragosa",
      "durationMs": 382000,
      "result": "kill",
      "players": [
        {
          "name": "Tuskal",
          "dps": 12432,
          "hps": 0,
          "damage": 5234234,
          "healing": 0,
          "deaths": 0
        }
      ],
      "deaths": [],
      "consumables": {}
    }
  ]
}
```

---

# Upload al Backend

# Endpoint

```txt
POST /logs/upload
```

---

# Payload

Se espera el JSON resumido generado por el worker. El backend lo procesará vinculando las peleas y jugadores automáticamente.

---

# Backend Express

## Responsabilidades

- validar auth (authMiddleware)
- validar JSON
- guardar DB (Modelos: Log, Fight, FightPlayer)
- devolver UUID del log creado

---

# Backend NO debe:

- parsear logs gigantes (responsabilidad del frontend)
- reconstruir peleas desde el raw
- procesar 300MB de texto

---

# PostgreSQL

# Estructura de Tablas Implementada

## logs

- id (UUID)
- originalSize
- uploadedBy
- date

## fights

- id (SERIAL)
- logId (FK -> logs.id)
- boss
- result
- durationMs
- deaths (JSONB)
- consumables (JSONB)

## fight_players

- id (SERIAL)
- fightId (FK -> fights.id)
- name
- characterClass
- damage
- healing
- dps
- hps
- deathsCount

---

# Página de visualización

## Rutas de API Disponibles

### Listado de Logs

```txt
GET /logs
```

### Detalle de Log (Cabecera + lista de peleas)

```txt
GET /logs/:logId
```

### Detalle de Pelea (Estadísticas de jugadores)

```txt
GET /logs/fight/:fightId
```

---

# Vista general

```txt
Sindragosa - Kill - 6:12
Lich King - Wipe - 4:03
```

---

# Vista de pelea

## Mostrar

- DPS rankings
- HPS rankings
- deaths
- consumables
- duración
- resultado

---

# Performance

# Objetivo

Procesar:

```txt
300MB
```

En:

```txt
10–40 segundos
```

Dependiendo del hardware.

---

# Recomendaciones críticas

## SIEMPRE usar Worker

---

## NO usar file.text()

---

## NO guardar eventos completos

---

## NO usar regex pesadas

---

## Procesar línea por línea

---

## Descartar líneas inmediatamente

---

# MVP recomendado

# Incluir

- fight detection
- boss detection
- damage
- healing
- deaths
- consumables
- rankings

---

# NO incluir inicialmente

- replay timeline
- buff uptime completo
- absorptions avanzadas
- casts timeline detallado
- comparisons avanzadas
- spell analytics complejos

---

# Resultado esperado del MVP

Un sistema tipo:

```txt
Details! web para guild privada
```

Con:

- historial de peleas
- rankings
- progression
- kills/wipes
- estadísticas básicas

Sin intentar competir con Warcraft Logs.
