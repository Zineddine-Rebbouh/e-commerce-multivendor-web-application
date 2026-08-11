const mongoose = require("mongoose")

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: false,
    },
    screenshots: [
      {
        type: String, // Assuming you store URLs of the screenshots
      },
    ],
  },
  {
    timestamps: true,
  }
)

reviewSchema.index({ productId: 1 })
reviewSchema.index({ userId: 1 })

const Review = mongoose.model("Review", reviewSchema)
module.exports = Review
