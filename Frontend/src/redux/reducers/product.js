import { createReducer, createAction } from "@reduxjs/toolkit"
const initialState = {
  isLoading: true,
  products: [],
  error: null,
}

// Create reducer using createReducer and addCase
export const productReducer = createReducer(initialState, builder => {
  builder
    .addCase("getAllProductsRequest", state => {
      state.isLoading = true
    })
    .addCase("getAllProductsSuccess", (state, action) => {
      state.isLoading = false
      state.products = action.payload
    })
    .addCase("getAllProductsFailed", (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
})
