const mongoose = require("mongoose")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const Product = require("../models/Product")

// POST endpoint handler
const Checkout = async (req, res) => {
  try {
    const { cartItems } = req.body

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: "Not enough data to checkout" })
    }

    // Build the server-side line items. Never trust client-supplied prices.
    const lineItems = []
    for (const cartItem of cartItems) {
      if (!mongoose.Types.ObjectId.isValid(cartItem._id)) {
        return res.status(400).json({ message: "Invalid product id" })
      }

      const product = await Product.findById(cartItem._id)

      if (!product) {
        return res
          .status(400)
          .json({ message: `Product not found: ${cartItem._id}` })
      }

      const quantity = Math.max(1, parseInt(cartItem.quantity, 10) || 1)
      if (product.available_quantity < quantity) {
        return res.status(400).json({
          message: `Not enough stock for "${product.name}" (${product.available_quantity} left)`,
        })
      }

      if (!product.price || product.price <= 0) {
        return res.status(400).json({
          message: `Product "${product.name}" has an invalid price`,
        })
      }

      lineItems.push({
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
            metadata: {
              productId: product._id.toString(),
              description: truncateDescription(product.description),
              url: product.image?.url || "",
              shopId: product.shopId.toString(),
            },
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: (process.env.SHIPPING_ALLOWED_COUNTRIES || "US")
          .split(",")
          .map(c => c.trim().toUpperCase())
          .filter(Boolean),
      },
      shipping_options: [
        { shipping_rate: process.env.STRIPE_SHIPPING_RATE_STANDARD },
        { shipping_rate: process.env.STRIPE_SHIPPING_RATE_EXPRESS },
      ].filter(option => option.shipping_rate),
      line_items: lineItems,
      client_reference_id: req.userId,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cancel`,
    })

    // NOTE: the user's cart is intentionally NOT deleted here. Cart removal
    // happens in the Stripe webhook only after payment is confirmed, so a
    // failed or abandoned payment does not empty the customer's cart.

    res.status(200).json(session)
  } catch (err) {
    console.error("Error during checkout:", err.message)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// Function to truncate description if it exceeds 500 characters
const truncateDescription = description => {
  const maxLength = 500
  return description && description.length > maxLength
    ? description.slice(0, maxLength)
    : description
}

module.exports = { Checkout }