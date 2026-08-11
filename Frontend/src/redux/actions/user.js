import { API_BASE } from "../../api/api-Client"

export const LoadUser = () => async dispatch => {
  try {
    dispatch({
      type: "LoadUserRequest",
    })

    const res = await fetch(`${API_BASE}/api/user/currentUser`, {
      method: "GET",
      credentials: "include",
    })

    if (!res.ok) {
      dispatch({
        type: "LoadUserFailure",
        payload: "You need to login first",
      })
      return
    }

    const data = await res.json()
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    })
  } catch (error) {
    dispatch({
      type: "clearError",
      payload:
        error.response && error.response.data
          ? error.response.data.message
          : error.message,
    })
  }
}

export const updateUserInformation = userData => async dispatch => {
  try {
    dispatch({ type: "USER_UPDATE_REQUEST" })

    const res = await fetch(`${API_BASE}/api/user/profile`, {
      method: "PUT",
      credentials: "include",
      body: userData,
    })

    if (!res.ok) {
      const errorData = await res.json()
      dispatch({
        type: "USER_UPDATE_FAIL",
        payload: errorData.message || "Failed to update user information",
      })
      return
    }

    const data = await res.json()

    dispatch({ type: "USER_UPDATE_SUCCESS", payload: data.user })
  } catch (error) {
    dispatch({
      type: "USER_UPDATE_FAIL",
      payload:
        error.response && error.response.data
          ? error.response.data.message
          : error.message,
    })
  }
}