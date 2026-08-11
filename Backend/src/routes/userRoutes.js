const express = require("express")
const router = express.Router()
const {
  getUser,
  getCurrentUserUser,
  getUsers,
  deleteUser,
  deleteUserById,
  addToCart,
  addWhislist,
  getUserCartItems,
  refundOrder,
  getUserWhilistItems,
  removeFromWhislist,
  removeFromCart,
  updateUserInformation,
  updateCart,
} = require("../controllers/userController")
const upload = require("../utils/multer")
const { validateToken } = require("../middelware/validateToken")
const { requireAdmin } = require("../middelware/roles")
const { Checkout } = require("../controllers/CheckoutController")

router.get("/", validateToken, requireAdmin, getUsers)
router.get("/currentUser", validateToken, getCurrentUserUser)
router.put(
  "/profile",
  upload.single("avatar"),
  validateToken,
  updateUserInformation
)

router.get("/cart", validateToken, getUserCartItems)
router.get("/whislist", validateToken, getUserWhilistItems)
router.post("/checkout", validateToken, Checkout)

router.put("/add-to-cart", validateToken, addToCart)
router.put("/update-cart", validateToken, updateCart)
router.delete("/remove-from-cart/:id", validateToken, removeFromCart)

router.put("/add-to-whislist", validateToken, addWhislist)
router.delete("/remove-from-whislist/:id", validateToken, removeFromWhislist)

// refund and transection
router.post("/refund", validateToken, refundOrder)

//delete user
router.delete("/", validateToken, deleteUser)
router.delete("/:id", validateToken, requireAdmin, deleteUserById)
router.get("/:id", validateToken, getUser)

module.exports = router