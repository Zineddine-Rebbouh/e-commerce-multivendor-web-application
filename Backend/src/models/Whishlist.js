const mongoose = require("mongoose")

const whishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
})

whishlistSchema.index({ userId: 1, productId: 1 })

module.exports = mongoose.model("Whishlist", whishlistSchema)
