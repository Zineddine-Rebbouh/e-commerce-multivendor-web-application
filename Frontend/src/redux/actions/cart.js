import * as apiClient from "../../api/api-Client"
// add to cart

export const addTocart = (data, userId) => async (dispatch, getState) => {
  dispatch({
    type: "addToCart",
    payload: data,
  })

  if (userId) {
    try {
      // Send request to backend to save cart items associated with the user
      await apiClient.saveCartItemsToBackend(getState().cart.cart)

      // Fetch updated cart items from backend after saving
      const cartItems = await apiClient.getUserCartItems()
      console.log(cartItems)
      // Merge fetched cart items with existing cart items in Redux
      dispatch({
        type: "mergeCartItems",
        payload: cartItems,
      })
    } catch (error) {
      console.error("Error saving cart items to backend:", error)
      // Optionally, dispatch an action to handle error states
    }
  } else {
    // If user is not logged in, just save the cart items in Redux
    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart))
  }
}

export const updateCart = data => async (dispatch, getState) => {
  dispatch({
    type: "updateCart",
    payload: data,
  })
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart))
  return data
}

// remove from cart
export const removeFromCart = (data, userId) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data,
  })

  if (userId) {
    try {
      // Send request to backend to save cart items associated with the user
      await apiClient.removeFromCart(data)

      // Fetch updated cart items from backend after saving

      // Merge fetched cart items with existing cart items in Redux
    } catch (error) {
      console.error("Error saving cart items to backend:", error)
      // Optionally, dispatch an action to handle error states
    }
  }

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart))
  return data
}

export const clearCart = () => async (dispatch, getState) => {
  dispatch({
    type: "clearCart",
  })

  console.log("clear cart")
  //clear item
  localStorage.setItem("cartItems", [])
  return true
}

export const transferCartItems = () => async (dispatch, getState) => {
  dispatch({
    type: "transferCartToBackend",
  })

  return true
}

export const getUserCartItems = () => async (dispatch, getState) => {
  dispatch({
    type: "fetchCartItemsRequest",
  })

  try {
    // Fetch cart items from backend
    const cartItems = await apiClient.getUserCartItems()
    console.log(cartItems)

    // Merge fetched cart items with existing cart items in Redux
    dispatch({
      type: "fetchCartItemsSuccess",
      payload: cartItems,
    })
  } catch (error) {
    console.error("Error fetching cart items:", error)
    dispatch({
      type: "fetchCartItemsFailure",
      payload: error.message,
    })
  }
}
