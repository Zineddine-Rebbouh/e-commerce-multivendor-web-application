const mongoose = require("mongoose")

const discountSchema = new mongoose.Schema(
  {
    discount_rate: {
      type: Number,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
      default: Date.now(),
    },
    end_date: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Discount", discountSchema)
