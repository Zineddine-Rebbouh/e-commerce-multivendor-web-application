const mongoose = require("mongoose")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    Brands: {
      type: [String],
      required: true,
    },
    image: {
      url: {
        type: String,
        required: true,
      },
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    available_quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    isHavingDiscount: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 3,
    },
    total_sell: {
      type: Number,
      default: 0,
    },
    discountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Discount",
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model("Product", productSchema)

productSchema.index({ shopId: 1 })
productSchema.index({ categoryId: 1 })
productSchema.index({ discountId: 1 })

module.exports = Product
