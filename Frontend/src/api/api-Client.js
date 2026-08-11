// Central API client. All calls use the VITE_API_URL env var (set in
// .env / Vercel dashboard) and fall back to the local dev server.

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(
  /\/$/,
  ""
)

export { API_BASE }

const request = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    credentials: "include",
    ...options,
  })

  let responseBody
  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    responseBody = await response.json()
  } else {
    responseBody = await response.text()
  }

  if (!response.ok) {
    const message =
      (responseBody && (responseBody.message || responseBody.error)) ||
      `Request failed with status ${response.status}`
    throw new Error(message)
  }

  return responseBody
}

// ---------------------------------------------------------------- Auth
export const register = async formData => {
  await request("/api/auth/register", { method: "POST", body: formData })
}

export const Login = async formData => {
  const body = await request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
  return body
}

export const logout = async () => {
  await request("/api/auth/logout", { method: "GET" })
}

// ---------------------------------------------------------------- Users
export const getUsers = async () => request("/api/user")
export const getUser = async userId => request(`/api/user/${userId}`)
export const removeUser = async userId =>
  request(`/api/user/${userId}`, { method: "DELETE" })
export const deleteCurrentUserAccount = async () =>
  request("/api/user", { method: "DELETE" })
export const getCurrentUser = async () => request("/api/user/currentUser")
export const updateProfile = async formData =>
  request("/api/user/profile", { method: "PUT", body: formData })

// ---------------------------------------------------------------- Notifications
export const getNotifications = async () => request("/api/notifications")

// ---------------------------------------------------------------- Categories
export const getCateogries = async () => request("/api/categories")
export const addCategory = async (id, data) =>
  request(`/api/categories/add/${id}`, { method: "POST", body: data })
export const updateCategory = async (id, data) =>
  request(`/api/categories/update/${id}`, { method: "PUT", body: data })
export const deleteCategory = async id =>
  request(`/api/categories/remove/${id}`, { method: "DELETE" })

// ---------------------------------------------------------------- Products
export const getProducts = async () => request("/api/products")
export const getBestProducts = async () => request("/api/products/best-deals")
export const getFeatureProducts = async () =>
  request("/api/products/fearture-deals")
export const getProduct = async productId =>
  request(`/api/products/${productId}`)
export const getProductByCategory = async productId =>
  request(`/api/products/get-category-products/${productId}`)
export const addProdcut = async formData =>
  request("/api/products/add", { method: "POST", body: formData })
export const removeProduct = async productId =>
  request(`/api/products/${productId}`, { method: "DELETE" })
export const deleteProduct = async productId =>
  request(`/api/products/${productId}`, { method: "DELETE" })
export const updateProduct = async (productId, formData) =>
  request(`/api/products/update/${productId}`, { method: "PUT", body: formData })

// ---------------------------------------------------------------- Shops
export const getShops = async () => request("/api/shop")
export const getShop = async shopId => request(`/api/shop/${shopId}`)
export const getRequestsShop = async () => request("/api/shop/shop-requests")
export const createRequestShop = async formData =>
  request("/api/shop/create-request-shop", {
    method: "POST",
    body: formData,
  })
export const updateShop = async (shopId, formData) =>
  request(`/api/shop/${shopId}`, { method: "PUT", body: formData })
export const deleteShop = async shopId =>
  request(`/api/shop/${shopId}`, { method: "DELETE" })
export const approveShopRequest = async id =>
  request(`/api/shop/create-shop/${id}`, { method: "POST" })
export const rejectShopRequest = async (id, reason) =>
  request(`/api/shop/reject-shop/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reason }),
  })
export const getProdutctsByShopId = async shopId =>
  request(`/api/shop/products/${shopId}`)
export const getShopOrdersByShopId = async shopId =>
  request(`/api/shop/orders/${shopId}`)

// ---------------------------------------------------------------- Orders
export const getOrders = async () => request("/api/order")
export const getOrder = async orderId => request(`/api/order/${orderId}`)
export const getOrdersByUserId = async userId =>
  request(`/api/order/get-customer-orders/${userId}`)
export const updateOrderStatus = async (orderId, status) =>
  request(`/api/order/update-status/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })

// ---------------------------------------------------------------- Cart / Wishlist
export const getUserCartItems = async () => request("/api/user/cart")
export const saveCartItemsToBackend = async cartItems =>
  request("/api/user/add-to-cart", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cartItems),
  })
export const removeFromCart = async id =>
  request(`/api/user/remove-from-cart/${id}`, { method: "DELETE" })
export const getUserWhilistItems = async () => request("/api/user/whislist")
export const saveWishlistItemsToBackend = async wishlistItems =>
  request("/api/user/add-to-whislist", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wishlistItems),
  })
export const removeFromWishlist = async id =>
  request(`/api/user/remove-from-whislist/${id}`, { method: "DELETE" })

// ---------------------------------------------------------------- Payment
export const checkout = async (cartItems, customer) =>
  request("/api/user/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cartItems, customer }),
  })
export const refundOrder = async orderId =>
  request("/api/user/refund", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ orderId }),
  })

// ---------------------------------------------------------------- Reviews
export const addRating = async data =>
  request(`/api/review/${data.id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

// ---------------------------------------------------------------- Reports
export const getReports = async () => request("/api/reports")
export const createReport = async formData =>
  request("/api/reports/", { method: "POST", body: formData })