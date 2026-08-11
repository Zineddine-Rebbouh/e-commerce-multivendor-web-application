const mongoose = require("mongoose")

const ShippingAdresse = new mongoose.Schema({
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  street: { type: String, required: true },
  state: { type: String, required: true },
})

const ShippingAdresseModel = mongoose.model("ShippingAdresse", ShippingAdresse)

module.exports = ShippingAdresseModel
