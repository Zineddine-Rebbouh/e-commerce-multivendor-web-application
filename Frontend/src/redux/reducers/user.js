import { createReducer } from "@reduxjs/toolkit"

const initialState = {
  isAuthenticated: false,
  loading: false,
  user: null,
  error: null,
}

export const userReducer = createReducer(initialState, builder => {
  builder
    .addCase("LoadUserRequest", state => {
      state.loading = true
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.isAuthenticated = true
      state.loading = false
      state.user = action.payload
    })
    .addCase("LoadUserFailure", (state, action) => {
      state.isAuthenticated = false
      state.loading = false
      state.error = action.payload
    })
    .addCase("clearError", state => {
      state.error = null
    })
    .addCase("USER_UPDATE_REQUEST", state => {
      state.loading = true
      state.error = null
    })
    .addCase("USER_UPDATE_SUCCESS", (state, action) => {
      state.user = action.payload
      state.loading = false
      state.error = null
      state.isAuthenticated = true // Assuming successful update keeps the user authenticated
    })
    .addCase("USER_UPDATE_FAIL", (state, action) => {
      state.loading = false
      state.error = action.payload
    })
})
