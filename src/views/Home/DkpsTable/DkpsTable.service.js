export const header = ['Personaje', 'Clase', 'Rango', 'Dkps']
export const colorsClass = [
  { color: '#8788EE', class: 'Warlock' },
  { color: '#C41E3A', class: 'Death Knight' },
  { color: '#AAD372', class: 'Hunter' },
  { color: '#0070DD', class: 'Shaman' },
  { color: '#FF7C0A', class: 'Druid' },
  { color: '#C69B6D', class: 'Warrior' },
  { color: '#3FC7EB', class: 'Mage' },
  { color: '#3FC7EB', class: 'Mage' },
  { color: '#F48CBA', class: 'Paladin' },
  { color: '#FFF468', class: 'Rogue' },
  { color: '#FFFFFF', class: 'Priest' }
]

export const selectColor = (playerClass, _elemento) => {
  const filter = colorsClass.find((ele) => ele.class === playerClass)
  // if (!filter) {
  //   console.log(elemento)
  // }
  return filter?.color
}

export const rankPriority = {
  Lunatik: 1,
  Lunatika: 2,
  Cosmic: 3,
  'Astral Moon': 4,
  Stellar: 5,
  Eternal: 6,
  Mystic: 7,
  Crescent: 8,
  'New Moon': 9
}

export const orderFunction = (array) => {
  const newORder = array.sort((a, b) => a.name.localeCompare(b.name))
  return newORder
}

const BACK_END = import.meta.env.VITE_LOCAL

let API_BACK
let VITE_SCRAP
if (BACK_END) {
  API_BACK = 'http://192.168.18.24:3001'
  VITE_SCRAP = 'http://192.168.18.24:4000'
} else {
  API_BACK = import.meta.env.VITE_API
  VITE_SCRAP = import.meta.env.VITE_SCRAP
}
export const API = API_BACK
export const APISCRAP = VITE_SCRAP
