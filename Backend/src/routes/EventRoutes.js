const router = require("express").Router()

const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController")
const { validateToken } = require("../middelware/validateToken")
const { requireAdmin } = require("../middelware/roles")

router.post("/", validateToken, requireAdmin, createEvent)
router.get("/", getEvents)
router.get("/:id", getEvent)
router.put("/:id", validateToken, requireAdmin, updateEvent)
router.delete("/:id", validateToken, requireAdmin, deleteEvent)

module.exports = router