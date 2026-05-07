import { createSlice } from '@reduxjs/toolkit'
import { getLogs, getLogById, getFightById, uploadLog } from '../actions/actionsLogs'

const initialState = {
  parsing: {
    isParsing: false,
    progress: 0,
    total: 0,
    fightsCount: 0,
    linesProcessed: 0,
    playersCount: 0,
    duration: 0,
    result: null // Final summary
  },
  logs: [],
  currentLog: null,
  currentFight: null,
  loading: false,
  error: null
}

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    startParsing: (state) => {
      state.parsing.isParsing = true
      state.parsing.progress = 0
      state.parsing.fightsCount = 0
      state.parsing.result = null
    },
    updateParsingProgress: (state, action) => {
      state.parsing.progress = action.payload.processed
      state.parsing.total = action.payload.total
      state.parsing.fightsCount = action.payload.fightsCount
      state.parsing.linesProcessed = action.payload.linesProcessed
      state.parsing.playersCount = action.payload.playersCount
    },
    completeParsing: (state, action) => {
      state.parsing.isParsing = false
      state.parsing.result = action.payload
    },
    resetParsing: (state) => {
      state.parsing = initialState.parsing
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getLogs.pending, (state) => {
        state.loading = true
      })
      .addCase(getLogs.fulfilled, (state, action) => {
        state.loading = false
        state.logs = action.payload
      })
      .addCase(getLogs.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(getLogById.fulfilled, (state, action) => {
        state.currentLog = action.payload
      })
      .addCase(getFightById.fulfilled, (state, action) => {
        state.currentFight = action.payload
      })
      .addCase(uploadLog.pending, (state) => {
        state.loading = true
      })
      .addCase(uploadLog.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(uploadLog.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { startParsing, updateParsingProgress, completeParsing, resetParsing } = logSlice.actions
export default logSlice.reducer
