import { configureStore } from "@reduxjs/toolkit"
import { userReducer } from "./reducers/user"
import { wishlistReducer } from "./reducers/wishlist"
import { cartReducer } from "./reducers/cart"
import { shopReducer } from "./reducers/shop"
import { orderReducer } from "./reducers/order"
import { productReducer } from "./reducers/product"

const Store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    shop: shopReducer,
    order: orderReducer,
    products: productReducer,
  },
})

export default Store
