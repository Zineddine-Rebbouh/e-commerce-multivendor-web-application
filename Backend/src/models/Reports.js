const mongoose = require("mongoose")

const reportsSchema = new mongoose.Schema(
  {
    reportedUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reporterUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    screenshots: [
      {
        type: String, // Assuming you store URLs of the screenshots
      },
    ],
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      required: true,
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Reports", reportsSchema)
