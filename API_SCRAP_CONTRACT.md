# Warmane Character Scraper API

API para obtener datos de personajes de [Warmane Armory](https://armory.warmane.com).

## Base URL

```
http://localhost:5000
```

---

## Endpoints

### 1. Obtener Personaje

**GET** `/api/:character`

Obtiene los datos de un personaje desde el armory.

#### Parámetros de URL

| Parámetro | Tipo   | Requerido | Descripción                    |
|-----------|--------|-----------|--------------------------------|
| character | string | Sí        | Nombre del personaje a buscar |

#### Headers (Opcional)

| Header | Tipo   | Descripción                                                    |
|--------|--------|----------------------------------------------------------------|
| Cookie | string | Cookies de Cloudflare del cliente (formato: `cf_clearance=xxx; __cf_bm=yyy`) |

#### Query Parameters (Opcional)

| Parámetro | Tipo   | Descripción                                          |
|-----------|--------|------------------------------------------------------|
| cookies   | string | Cookies de Cloudflare alternativa (URL encoded)      |

#### Ejemplo de Request

```bash
# Con cookies en header
curl -X GET "http://localhost:5000/api/terryk" \
  -H "Cookie: cf_clearance=abc123xyz; __cf_bm=def456uvw"

# Con cookies en query parameter
curl -X GET "http://localhost:5000/api/terryk?cookies=cf_clearance%3Dabc123xyz%3B%20__cf_bm%3Ddef456uvw"
```

#### Response Exitosa (200)

```json
{
  "left": [
    {
      "target": "_blank",
      "href": "http://wotlk.cavernoftime.com/item=51143",
      "rel": "item=51143&ench=3818&gems=3637:3532:0&transmog=23308",
      "src": "http://cdn.warmane.com/wotlk/icons/large/inv_helmet_148.jpg",
      "width": "50",
      "height": "50"
    },
    {
      "target": "_blank",
      "href": "http://wotlk.cavernoftime.com/item=50682",
      "rel": "item=50682&gems=3532:0:0",
      "src": "http://cdn.warmane.com/wotlk/icons/large/item_icecrownnecklaceb.jpg",
      "width": "50",
      "height": "50"
    }
  ],
  "right": [
    {
      "target": "_blank",
      "href": "http://wotlk.cavernoftime.com/item=51144",
      "rel": "item=51144&ench=3253&gems=3537:0:0&transmog=23280",
      "src": "http://cdn.warmane.com/wotlk/icons/large/inv_gauntlets_83.jpg",
      "width": "50",
      "height": "50"
    }
  ],
  "bottom": [
    {
      "target": "_blank",
      "href": "http://wotlk.cavernoftime.com/item=50727",
      "rel": "item=50727&ench=2673&gems=3532:3532:3532",
      "src": "http://cdn.warmane.com/wotlk/icons/large/inv_weapon_staff_109.jpg",
      "width": "50",
      "height": "50"
    },
    {
      "href": "#self"
    }
  ],
  "scrapedAt": "2026-05-03T13:58:44.253Z"
}
```

#### Estructura de la Respuesta

| Campo    | Tipo     | Descripción                                      |
|----------|----------|------------------------------------------------|
| left     | array    | Items del lado izquierdo (head, neck, shoulder, cloak, chest, shirt, tabard, bracer) |
| right    | array    | Items del lado derecho (hands, waist, legs, feet, ring1, ring2, trinket1, trinket2) |
| bottom   | array    | Items de abajo (weapon, ranged/shield, offhand) |
| scrapedAt| string   | Timestamp ISO de cuando se hizo el scrape       |

#### Estructura de Cada Item

| Campo   | Tipo   | Descripción                                           |
|---------|--------|------------------------------------------------------|
| target  | string | Siempre `"_blank"` (presente en casi todos los items)|
| href    | string | URL completa al item en la base de datos de WoW      |
| rel     | string | Parámetros del item (item ID, encantamientos, gemas, transfiguración) - puede no estar presente |
| src     | string | URL de la imagen/icono del item                      |
| width   | string | Ancho de la imagen (siempre `"50"`)                   |
| height  | string | Alto de la imagen (siempre `"50"`)                   |

#### Response de Error

| Código | Descripción                              |
|--------|------------------------------------------|
| 400    | Nombre de personaje inválido            |
| 404    | Personaje no encontrado                  |
| 500    | Error interno del servidor               |
| 503    | Cloudflare bloqueó el acceso             |

```json
{
  "error": "Personaje no encontrado"
}
```

---

### 2. Estado del Servidor

**GET** `/health`

Verifica el estado del servidor y sus componentes.

#### Response (200)

```json
{
  "status": "ok",
  "uptime": 3600.5,
  "memory": {
    "heapUsed": "45MB",
    "heapTotal": "128MB",
    "rss": "150MB"
  },
  "cache": 5,
  "browserActive": true,
  "cfCookiesValid": true,
  "cfCookiesAge": "300s"
}
```

---

### 3. Limpiar Cache

**GET** `/cache/clear`

Limpia todas las entradas en cache.

#### Response (200)

```json
{
  "message": "Cache cleared",
  "removedEntries": 5
}
```

---

### 4. Renovar Cookies

**GET** `/cookies/renew`

Fuerza la renovación de cookies de Cloudflare usando Puppeteer.

#### Response Exitosa (200)

```json
{
  "message": "Cookies renovadas exitosamente"
}
```

#### Response de Error (500)

```json
{
  "error": "Error renovando cookies",
  "detail": "No se obtuvo cf_clearance — Cloudflare no resolvió"
}
```

---

### 5. Info del API

**GET** `/`

Retorna información general del API.

#### Response (200)

```json
{
  "message": "Warmane Character Scraper API",
  "usage": "GET /api/{character}",
  "endpoints": {
    "scrape": "/api/{character}",
    "health": "/health",
    "clearCache": "/cache/clear",
    "renewCookies": "/cookies/renew"
  },
  "stats": {
    "cache": "5 characters cached",
    "memory": "45MB",
    "browserActive": true,
    "cfCookiesValid": true
  }
}
```

---

## Cómo Enviar Cookies al Backend

### Paso 1: Obtener Cookies desde el Navegador

1. Abre DevTools (F12)
2. Ve a **Application** → **Storage** → **Cookies** → `https://armory.warmane.com`
3. Copia el valor de `cf_clearance` y otras cookies relevantes

### Paso 2: Enviar Cookies al API

#### Opción A: En el Header `Cookie`

```javascript
// JavaScript (fetch)
const response = await fetch('/api/terryk', {
  headers: {
    'Cookie': 'cf_clearance=tu_valor_aqui; __cf_bm=otro_valor'
  }
});
```

#### Opción B: Como Query Parameter

```javascript
// JavaScript (fetch)
const cookies = 'cf_clearance=tu_valor_aqui; __cf_bm=otro_valor';
const response = await fetch(`/api/terryk?cookies=${encodeURIComponent(cookies)}`);
```

#### Opción C: Extrayendo cookies automáticamente

```javascript
// Si el frontend está en el mismo dominio, puede extraer cookies del navegador
const cookies = document.cookie; // Obtiene todas las cookies del documento actual
// Luego enviar al backend
```

### Formato de Cookies

```
cf_clearance=TOKEN_GENERADO_POR_CLOUDFLARE; __cf_bm=HASH_DE_BOT_MANAGEMENT; otras_cookies...
```

---

## Flujo de Cookies (Precedencia)

1. **Cookies del cliente** → Si se envían, son usadas primero
2. **Cookies del servidor** → Si están válidas, segundo intento
3. **Puppeteer stealth** → Último recurso (puede fallar)

---

## Códigos de Error Comunes

| Error                        | Causa                                      | Solución                        |
|------------------------------|--------------------------------------------|---------------------------------|
| `Cloudflare challenge en respuesta — cookies expiradas` | Cookies inválidas o expiradas | Enviar cookies frescas del navegador |
| `No se pudo obtener cf_clearance` | Puppeteer no pudo resolver el challenge | Usar cookies del navegador |
| `Personaje no encontrado en el HTML` | El personaje no existe o cambió la estructura | Verificar nombre del personaje |

---

## Notas Importantes

- Las cookies de Cloudflare expiran aproximadamente cada 30 minutos
- Se recomienda que el frontend capture y envíe cookies del navegador
- El cache de personajes dura 5 minutos
- Máximo 2 requests simultáneos por servidor
- El campo `rel` contiene información detallada del item: encantamientos (`ench`), gemas (`gems`), y transfiguración (`transmog`)
- Algunos items en `bottom` pueden tener estructura mínima (solo `href: "#self"`)
