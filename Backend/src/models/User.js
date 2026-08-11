const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 1024,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Customer", "Seller"],
      default: "Customer",
    },
    avatar: {
      type: String,
      required: false,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: false,
    },
    orders: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Orders",
      required: false,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema)
