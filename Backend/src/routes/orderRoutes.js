const {
  getOrder,
  getOrders,
  getOrderByUserId,
  updateOrderStatus,
} = require("../controllers/OrderController")

const router = require("express").Router()
const { validateToken } = require("../middelware/validateToken")
const { requireAdmin } = require("../middelware/roles")

router.get("/", validateToken, requireAdmin, getOrders)
router.get("/get-customer-orders/:id", validateToken, getOrderByUserId)
router.put("/update-status/:id", validateToken, updateOrderStatus)
router.get("/:id", validateToken, getOrder)

module.exports = router