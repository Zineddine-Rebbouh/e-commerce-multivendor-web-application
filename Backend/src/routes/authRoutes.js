const express = require("express")
const router = express.Router()
const { register, login, logout } = require("../controllers/authController")
const { check, body } = require("express-validator")
const { validateToken } = require("../middelware/validateToken")
const upload = require("../utils/multer")

router.post(
  "/register",
  upload.single("avatar"),
  [
    body("name").notEmpty().withMessage("Full Name "),
    body("email").isEmail().withMessage("Invalid email format"),
    body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match")
        }
        return true
      })
      .withMessage("Passwords do not match"),
  ],
  register
)

router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  login
)

router.get("/logout", validateToken, logout)

module.exports = router
