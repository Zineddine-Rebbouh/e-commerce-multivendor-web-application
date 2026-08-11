import * as apiClient from "../../api/api-Client"

// get all orders of user
export const getAllOrdersOfUser = userId => async dispatch => {
  try {
    dispatch({
      type: "getAllOrdersUserRequest",
    })

    const data = await apiClient.getOrdersByUserId(userId)

    dispatch({
      type: "getAllOrdersUserSuccess",
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: "getAllOrdersUserFailed",
      payload: error.message || error.message,
    })
  }
}

// get all orders of seller
export const getAllOrdersOfShop = shopId => async dispatch => {
  try {
    dispatch({
      type: "getAllOrdersShopRequest",
    })

    const orders = await apiClient.getShopOrdersByShopId(shopId)

    dispatch({
      type: "getAllOrdersShopSuccess",
      payload: orders,
    })
  } catch (error) {
    dispatch({
      type: "getAllOrdersShopFailed",
      payload: error.message || "Failed to fetch shop orders",
    })
  }
}

// get all orders of Admin
export const getAllOrders = () => async dispatch => {
  try {
    dispatch({
      type: "adminAllOrdersRequest",
    })

    const data = await apiClient.getOrders()

    dispatch({
      type: "adminAllOrdersSuccess",
      payload: data.orders,
    })
  } catch (error) {
    dispatch({
      type: "adminAllOrdersFailed",
      payload: error.message || "Failed to fetch orders",
    })
  }
}