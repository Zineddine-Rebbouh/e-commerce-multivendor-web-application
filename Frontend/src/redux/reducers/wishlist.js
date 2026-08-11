import { createReducer } from "@reduxjs/toolkit"

const initialState = {
  wishlist: localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [],
}

export const wishlistReducer = createReducer(initialState, builder => {
  builder
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload
      const existingIndex = state.wishlist.findIndex(i => i._id === item._id)

      if (existingIndex !== -1) {
        state.wishlist = state.wishlist.map((i, index) =>
          index === existingIndex ? item : i
        )
      } else {
        // Add new item to wishlist if it doesn't exist
        state.wishlist.push(item)
      }
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist))
    })
    .addCase("removeFromWishlist", (state, action) => {
      state.wishlist = state.wishlist.filter(i => i._id !== action.payload)
      localStorage.setItem("wishlistItems", JSON.stringify(state.wishlist))
    })
    .addCase("fetchWishlistItemsRequest", state => {
      state.loading = true
    })
    .addCase("fetchWishlistItemsSuccess", (state, action) => {
      state.wishlist = action.payload
      state.loading = false
    })
    .addCase("fetchWishlistItemsFailure", (state, action) => {
      state.error = action.payload
      state.loading = false
    })
    .addCase("clearWishlist", state => {
      // Clear the cart
      console.log("clear wishlist")

      state.wishlist = []

      localStorage.setItem("wishlistItems", [])
    })
})
