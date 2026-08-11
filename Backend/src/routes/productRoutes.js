const router = require("express").Router()
const { body } = require("express-validator")

const {
  addOrEditProduct,
  getProducts,
  removeProduct,
  getProduct,
  updateProduct,
  getProductsByCategory,
  getBestProducts,
  getFeatureProducts,
} = require("../controllers/ProductController")
const upload = require("../utils/multer")
const { validateToken } = require("../middelware/validateToken")
const { requireSeller } = require("../middelware/roles")

router.post(
  "/add",
  upload.single("url"),
  validateToken,
  requireSeller,
  addOrEditProduct
)
router.get("/", getProducts)
router.get("/best-deals", getBestProducts)
router.get("/fearture-deals", getFeatureProducts)
router.get("/get-category-products/:productId", getProductsByCategory)
router.delete("/:id", validateToken, requireSeller, removeProduct)
router.get("/:id", getProduct)

router.put(
  "/update/:id",
  upload.single("url"),
  validateToken,
  requireSeller,
  updateProduct
)

module.exports = router