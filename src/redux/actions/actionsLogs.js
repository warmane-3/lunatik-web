import { createAsyncThunk } from '@reduxjs/toolkit'
import { API } from '../../views/Home/DkpsTable/DkpsTable.service'

export const uploadLog = createAsyncThunk(
  'logs/uploadLog',
  async ({ logData, userData }, thunkAPI) => {
    console.log('userData', userData)

    try {
      const response = await fetch(`${API}/logs/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...logData,
          user: userData.user,
          password: userData.password
        })
      })
      const data = await response.json()
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error)
      }
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getLogs = createAsyncThunk('logs/getLogs', async (_, thunkAPI) => {
  try {
    const response = await fetch(`${API}/logs`)
    const data = await response.json()
    if (!response.ok) {
      return thunkAPI.rejectWithValue(data.error)
    }
    return data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getLogById = createAsyncThunk(
  'logs/getLogById',
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`${API}/logs/${id}`)
      const data = await response.json()
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error)
      }
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getFightById = createAsyncThunk(
  'logs/getFightById',
  async (fightId, thunkAPI) => {
    try {
      const response = await fetch(`${API}/logs/fight/${fightId}`)
      const data = await response.json()
      if (!response.ok) {
        return thunkAPI.rejectWithValue(data.error)
      }
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)
