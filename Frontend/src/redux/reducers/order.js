import { createReducer } from "@reduxjs/toolkit"

const initialState = {
  isLoading: true,
}

export const orderReducer = createReducer(initialState, builder => {
  builder
    .addCase("getAllOrdersUserRequest", state => {
      state.isLoading = true
    })
    .addCase("getAllOrdersUserSuccess", (state, action) => {
      state.isLoading = false
      state.orders = action.payload
    })
    .addCase("getAllOrdersUserFailed", (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    .addCase("getAllOrdersShopRequest", state => {
      state.isLoading = true
    })
    .addCase("getAllOrdersShopSuccess", (state, action) => {
      state.isLoading = false
      state.orders = action.payload
    })
    .addCase("getAllOrdersShopFailed", (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
    .addCase("adminAllOrdersRequest", state => {
      state.isLoading = true
    })
    .addCase("adminAllOrdersSuccess", (state, action) => {
      state.isLoading = false
      state.orders = action.payload
    })
    .addCase("adminAllOrdersFailed", (state, action) => {
      state.isLoading = false
      state.error = action.payload
    })
})
