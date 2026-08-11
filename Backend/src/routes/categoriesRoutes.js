const express = require("express")
const router = express.Router()
const {
  addOrUpdateCategory,
  getCategories,
  removeCategory,
  getCategory,
  updateCategory,
} = require("../controllers/CategoriesController")
const upload = require("../utils/multer")
const { validateToken } = require("../middelware/validateToken")
const { requireAdmin } = require("../middelware/roles")

router.get("/", getCategories)
router.get("/:id", getCategory)
router.post(
  "/add/:id",
  upload.single("image"),
  validateToken,
  requireAdmin,
  addOrUpdateCategory
)
router.delete("/remove/:id", validateToken, requireAdmin, removeCategory)
router.put(
  "/update/:id",
  upload.single("image"),
  validateToken,
  requireAdmin,
  updateCategory
)

module.exports = router
