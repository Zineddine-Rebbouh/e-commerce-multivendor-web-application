const mongoose = require("mongoose")

const RequestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requestStatus: {
      type: String,
      required: true,
      default: "Pending",
    },
    requestDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "RequestShopDetails",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Request", RequestSchema)
