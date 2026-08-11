const User = require("../models/User")

const requireRole = (...roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.userId)
      if (!user) {
        return res.status(401).json({ message: "Not authorized" })
      }
      if (!roles.includes(user.role)) {
        return res
          .status(403)
          .json({ message: "Forbidden: insufficient role" })
      }
      req.user = user
      next()
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }
}

const requireAdmin = requireRole("Admin")
const requireSeller = requireRole("Seller", "Admin")
const requireAdminOrSeller = requireRole("Admin", "Seller")

module.exports = { requireRole, requireAdmin, requireSeller, requireAdminOrSeller }