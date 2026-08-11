const router = require("express").Router()

const {
  addNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/NotificationController")
const { validateToken } = require("../middelware/validateToken")

router.post("/add", validateToken, addNotification)
router.get("/", validateToken, getNotifications)
router.put("/mark-as-read/:id", validateToken, markAsRead)
router.delete("/delete/:id", validateToken, deleteNotification)

module.exports = router
