import { createAsyncThunk } from '@reduxjs/toolkit'
import { API } from '../../views/Home/DkpsTable/DkpsTable.service'
// import { objectPost } from '../../helpers/objetPost'

export const getMainAndAlters = createAsyncThunk(
  'players/getMainAndAlters',
  async (userValue, thunkAPI) => {
    try {
      // Realiza la llamada a la API con los datos del usuario
      const response = await fetch(`${API}/characters`)

      // Convierte la respuesta en JSON
      const data = await response.json()
      // console.log(data)
      return data
    } catch (error) {
      // Manejo de errores: puedes utilizar thunkAPI.rejectWithValue para pasar el error
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getActual = createAsyncThunk(
  'players/getActual',
  async (userValue, thunkAPI) => {
    try {
      // Realiza la llamada a la API con los datos del usuario
      const response = await fetch(`${API}/characters`)

      // Convierte la respuesta en JSON
      const data = await response.json()
      // console.log(data)
      return data
    } catch (error) {
      // Manejo de errores: puedes utilizar thunkAPI.rejectWithValue para pasar el error
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getFirst = createAsyncThunk(
  'players/getFirst',
  async (userValue, thunkAPI) => {
    try {
      // Realiza la llamada a la API con los datos del usuario
      const response = await fetch(`${API}/main/first`)

      // Convierte la respuesta en JSON
      const data = await response.json()
      // console.log(data)
      return data
    } catch (error) {
      // Manejo de errores: puedes utilizar thunkAPI.rejectWithValue para pasar el error
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getSecond = createAsyncThunk(
  'players/getSecond',
  async (userValue, thunkAPI) => {
    try {
      // Realiza la llamada a la API con los datos del usuario
      const response = await fetch(`${API}/main/second`)

      // Convierte la respuesta en JSON
      const data = await response.json()
      // console.log(data)
      return data
    } catch (error) {
      // Manejo de errores: puedes utilizar thunkAPI.rejectWithValue para pasar el error
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const deleteCharacter = createAsyncThunk(
  'players/deleteCharacter',
  async ({ name, userData }, thunkAPI) => {
    try {
      const response = await fetch(`${API}/characters/${name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error)
      }
      return { name, message: data.message }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const deleteAlter = createAsyncThunk(
  'players/deleteAlter',
  async ({ name, userData }, thunkAPI) => {
    try {
      const response = await fetch(`${API}/alter/${name}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
      const data = await response.json()
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error)
      }
      return { name, message: data.message }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)
