const mongoose = require("mongoose")

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  LineCartItemsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LineCartItems",
  },
})

cartSchema.index({ userId: 1 }, { unique: true })

module.exports = mongoose.model("Cart", cartSchema)
