// shopActions.js

import * as apiClient from "../../api/api-Client"

export const getShopDetails = shopId => async dispatch => {
  try {
    dispatch({
      type: "LoadShopDetails",
    })

    const data = await apiClient.getShop(shopId)
    console.log(data)
    dispatch({
      type: "getShopDetailsSuccess",
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: "getShopDetailsFailed",
      payload: error.response?.data?.message || error.message,
    })
  }
}

export const updateShopDetails = (shopId, shopDetails) => async dispatch => {
  try {
    dispatch({
      type: "updateShopDetailsRequest",
    })

    const data = await apiClient.updateShop(shopId, shopDetails)
    dispatch({
      type: "updateShopDetailsSuccess",
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: "updateShopDetailsFailed",
      payload: error.response?.data?.message || error.message,
    })
  }
}
