const router = require("express").Router()
const upload = require("../utils/multer")

const {
  getReports,
  deleteReport,
  createReport,
} = require("../controllers/ReportController")
const { validateToken } = require("../middelware/validateToken")
const { requireAdmin } = require("../middelware/roles")

router.get("/", validateToken, requireAdmin, getReports)
router.post("/", upload.array("screenshots", 5), validateToken, createReport)
router.delete("/:id", validateToken, requireAdmin, deleteReport)

module.exports = router