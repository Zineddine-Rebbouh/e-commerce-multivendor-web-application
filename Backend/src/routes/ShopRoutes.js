const router = require("express").Router()

const {
  createShop,
  getShops,
  getShop,
  updateShop,
  deleteShop,
  getShopProducts,
  getShopOrders,
  createRequestShop,
  getRequestsShop,
  approveRequest,
  rejectRequest,
} = require("../controllers/ShopController")
const { validateToken } = require("../middelware/validateToken")
const { requireAdmin, requireSeller } = require("../middelware/roles")
const upload = require("../utils/multer")

router.post(
  "/create-request-shop",
  validateToken,
  upload.single("avatar"),
  createRequestShop
)

router.post("/create-shop/:id", validateToken, requireAdmin, createShop)
router.put("/approve-shop/:id", validateToken, requireAdmin, approveRequest)
router.put("/reject-shop/:id", validateToken, requireAdmin, rejectRequest)
router.get("/", getShops)
router.get("/shop-requests", validateToken, requireAdmin, getRequestsShop)
router.get("/:id", getShop)
router.put("/:id", upload.single("avatar"), validateToken, requireSeller, updateShop)
router.delete("/:id", validateToken, deleteShop)
router.get("/products/:id", getShopProducts)
router.get("/orders/:id", validateToken, getShopOrders)

module.exports = router
