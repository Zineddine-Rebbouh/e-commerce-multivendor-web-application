const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: [
      "orderStatus",
      "productUpdate",
      "sellerUpdate",
      "accountActivity",
      "promotion",
      "feedback",
      "paymentUpdate",
      "cartUpdate",
      "wishlistUpdate",
      "shippingUpdate",
      "customerSupport",
      "platformUpdate",
      "recommendation",
    ],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shop",
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  promotionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Promotion",
  },
  feedbackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Feedback",
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
  wishlistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wishlist",
  },
  shippingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Shipping",
  },
  customerSupportId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerSupport",
  },
  platformUpdateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PlatformUpdate",
  },
  recommendationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Recommendation",
  },
})

notificationSchema.index({ userId: 1, createdAt: -1 })

const Notification = mongoose.model("Notification", notificationSchema)

module.exports = Notification
