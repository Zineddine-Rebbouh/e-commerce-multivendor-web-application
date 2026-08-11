import { API_BASE } from "../../api/api-Client"

export const getAllProducts = () => async dispatch => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    })

    const response = await fetch(`${API_BASE}/api/products`)
    if (!response.ok) {
      throw new Error("Failed to fetch products")
    }

    const data = await response.json()

    dispatch({
      type: "getAllProductsSuccess",
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload:
        error.response && error.response.data
          ? error.response.data.message
          : error.message,
    })
  }
}