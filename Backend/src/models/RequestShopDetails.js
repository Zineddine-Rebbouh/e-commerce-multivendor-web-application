const mongoose = require("mongoose")

const RequestShopDetailsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter your shop name!"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Please enter your shop phone number"],
    },
    email: {
      type: String,
      required: [true, "Please enter your shop email address"],
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    zipCode: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("RequestShopDetails", RequestShopDetailsSchema)
