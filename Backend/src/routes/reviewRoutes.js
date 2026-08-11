const router = require("express").Router()
const { validateToken } = require("../middelware/validateToken")
const {
  createReview,
  getReviews,
  deleteReview,
  updateReview,
} = require("../controllers/reviewController")
const upload = require("../utils/multer")

router.post("/:id", upload.array("screenshots", 5), validateToken, createReview)
router.get("/:id", getReviews)
router.delete("/:id", validateToken, deleteReview)
router.put("/:id", validateToken, updateReview)

module.exports = router