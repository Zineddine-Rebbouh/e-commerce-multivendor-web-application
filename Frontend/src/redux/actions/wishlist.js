import * as apiClient from "../../api/api-Client"
// add to wishlist

export const addToWishlist = (data, userId) => async (dispatch, getState) => {
  dispatch({
    type: "addToWishlist",
    payload: data,
  })
  console.log("add to wishlist 2")

  if (userId) {
    try {
      // Send request to backend to save wishlist items associated with the user
      await apiClient.saveWishlistItemsToBackend(getState().wishlist.wishlist)

      // Fetch updated wishlist items from backend after saving
      const wishlistItems = await apiClient.getUserWhilistItems()
      dispatch({
        type: "fetchWishlistItemsSuccess",
        payload: wishlistItems,
      })
    } catch (error) {
      console.error("Error saving wishlist items to backend:", error)
      // Optionally, dispatch an action to handle error states
      dispatch({
        type: "fetchWishlistItemsFailure",
        payload: error.message,
      })
    }
  }

  console.log("add to wishlist")

  localStorage.setItem(
    "wishlistItems",
    JSON.stringify(getState().wishlist.wishlist)
  )
}

// remove from wishlist
export const removeFromWishlist =
  (data, userId) => async (dispatch, getState) => {
    dispatch({
      type: "removeFromWishlist",
      payload: data,
    })

    if (userId) {
      try {
        // Send request to backend to save wishlist items associated with the user
        await apiClient.removeFromWishlist(data)

        // Fetch updated wishlist items from backend after saving

        // Merge fetched wishlist items with existing wishlist items in Redux
      } catch (error) {
        console.error("Error saving wishlist items to backend:", error)
        // Optionally, dispatch an action to handle error states
      }
    }
    // If user is not logged in, just save the wishlist items in Redux
    localStorage.setItem(
      "wishlistItems",
      JSON.stringify(getState().wishlist.wishlist)
    )
  }

export const getUserWhilistItems = () => async dispatch => {
  dispatch({
    type: "fetchWishlistItemsRequest",
  })

  try {
    // Fetch wishlist items from backend
    const wishlistItems = await apiClient.getUserWhilistItems()
    dispatch({
      type: "fetchWishlistItemsSuccess",
      payload: wishlistItems,
    })
  } catch (error) {
    console.error("Error fetching wishlist items:", error)
    dispatch({
      type: "fetchWishlistItemsFailure",
      payload: error.message,
    })
  }
}

export const clearWishlist = () => async (dispatch, getState) => {
  dispatch({
    type: "clearWishlist",
  })

  console.log("clear cart")
  //clear item
  localStorage.setItem("wishlistItems", [])
  return true
}
