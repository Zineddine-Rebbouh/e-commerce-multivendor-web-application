const mongoose = require("mongoose")

const LineOrderItemsSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
})

const LineOrderItems = mongoose.model("LineOrderItems", LineOrderItemsSchema)

LineOrderItemsSchema.index({ orderId: 1 })
LineOrderItemsSchema.index({ productId: 1 })

module.exports = LineOrderItems
