const mongoose = require("mongoose")

const LineCartItemsSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
)

const LineCartItems = mongoose.model("LineCartItems", LineCartItemsSchema)

LineCartItemsSchema.index({ cartId: 1, productId: 1 })

module.exports = LineCartItems
