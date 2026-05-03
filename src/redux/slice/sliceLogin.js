import { createSlice } from '@reduxjs/toolkit'
import { loginUser } from '../actions/actionsLogin'

const initialState = {
  user: null,
  error: '',
  loading: false
}

// aqui se generan los reducers y las acciones
export const userSlice = createSlice({
  // name es el nombre del slice
  name: 'user',
  initialState,
  // reducers => iran todos los reducers q vamos a crear
  reducers: {
    addUser: (state, action) => {
      state.user = action.payload
    },
    logoutUser: (state) => {
      state.user = null
    }
  },
  // 3 acciones asincronas por cada acción creada
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

// La funcion "createSlice" de redux-toolkit, crea 2 propiedades dentro de "userSlice"
// estas propieades son ".actions" y ".reducer"
export const { addUser, logoutUser } = userSlice.actions
export default userSlice.reducer // esto es el userReducer usado en el archivo store.js
