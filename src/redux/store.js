import { configureStore, combineReducers } from '@reduxjs/toolkit'
import userReducer from './slice/sliceLogin.js'
import playerSlice from './slice/playerSlice.js'
import logSlice from './slice/logSlice.js'
import storage from 'redux-persist/lib/storage'
import { persistReducer } from 'redux-persist'
import thunk from 'redux-thunk'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userState']
}

const rootReducer = combineReducers({
  userState: userReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: {
    user: persistedReducer,
    players: playerSlice,
    logs: logSlice
  },
  middleware: [thunk]
})

export default store
