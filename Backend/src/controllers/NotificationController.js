const Notification = require("../models/Notification")

const addNotification = async (req, res) => {
  try {
    // Force the notification to belong to the authenticated user unless the
    // caller is an admin
    const userId =
      req.user && req.user.role === "Admin" ? req.body.userId : req.userId
    const { type, message } = req.body

    const notification = new Notification({ userId, type, message })

    await notification.save()

    res.status(201).json({
      success: true,
      message: "Notification added successfully",
      notification,
    })
  } catch (error) {
    console.error("Error adding notification:", error)
    res.status(500).json({
      success: false,
      message: "Failed to add notification",
      error: error.message,
    })
  }
}

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.userId })
    return res.status(200).json(notifications)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id
    const notification = await Notification.findById(notificationId)
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }
    // Only the owner (or an admin) may mark it as read
    if (
      req.user &&
      req.user.role !== "Admin" &&
      String(notification.userId) !== String(req.userId)
    ) {
      return res.status(403).json({ message: "Forbidden" })
    }
    notification.read = true
    await notification.save()
    return res.status(200).json({ message: "Notification Updated" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id
    const notification = await Notification.findById(notificationId)
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }
    // Only the owner (or an admin) may delete it
    if (
      req.user &&
      req.user.role !== "Admin" &&
      String(notification.userId) !== String(req.userId)
    ) {
      return res.status(403).json({ message: "Forbidden" })
    }
    await notification.deleteOne()
    return res.status(200).json({ message: "Notification Removed " })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  addNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
}
