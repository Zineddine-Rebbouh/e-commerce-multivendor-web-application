const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 8000
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const cors = require("cors")
const rateLimit = require("express-rate-limit")
const authRoutes = require("./routes/authRoutes")
const path = require("path")
const cloudinary = require("cloudinary").v2

const userRoutes = require("./routes/userRoutes")
const categoriesRoutes = require("./routes/categoriesRoutes")
const productsRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes")
const ShopRoutes = require("./routes/ShopRoutes")
const ReviewRoutes = require("./routes/reviewRoutes")
const ErrorHandler = require("./utils/ErrorHandler")
const User = require("./models/User")
const Order = require("./models/Order")
const LineOrderItems = require("./models/LineOrderItems")
const ShippingAdresseModel = require("./models/ShippingAdresse")
const Shop = require("./models/Shop")
const { parse } = require("dotenv")
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
const reportsRoutes = require("./routes/ReportRoutes")
const Product = require("./models/Product")
const Cart = require("./models/Cart")
const eventRoutes = require("./routes/EventRoutes")
const notificationRoutes = require("./routes/NotificationRoutes")

// CORS: allow origins from a comma-separated CORS_ORIGIN env var.
// Falls back to the local dev origin when unset.
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
)

// Rate limiting for authentication and payment endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
})

const webhookLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
})

app.post(
  "/webhook",
  webhookLimiter,
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"]
    const payload = req.body
    let event

    try {
      // Construct Stripe event from the payload and signature
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )

      // Handle the checkout session completed event
      if (event.type === "checkout.session.completed") {
        const session = event.data.object

        // Idempotency guard: if an order already exists for this payment
        // intent, acknowledge the event without creating duplicates.
        const existingOrder = await Order.findOne({
          "paymentResult.id": session.payment_intent,
        })
        if (existingOrder) {
          return res
            .status(200)
            .json({ received: true, duplicate: true })
        }

        // Create customer object
        const customer = {
          ClientId: session.client_reference_id,
          email: session.customer_email,
          name: session.customer_name,
        }

        // Verify the customer actually exists before creating an order
        if (!customer.ClientId) {
          return res
            .status(400)
            .json({ error: "Missing client_reference_id" })
        }
        const customerUser = await User.findById(customer.ClientId)
        if (!customerUser) {
          return res.status(400).json({ error: "Customer not found" })
        }

        // Retrieve the full session including line items
        const retrieveSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ["line_items.data.price.product"],
          }
        )

        const lineItems = retrieveSession?.line_items?.data
        if (!lineItems || lineItems.length === 0) {
          return res.status(400).json({ error: "No line items found" })
        }

        // Map line items to order items
        const orderItems = lineItems.map(item => ({
          productId: new mongoose.Types.ObjectId(
            item.price.product.metadata.productId
          ),
          quantity: item.quantity,
        }))

        // Create a new shipping address document
        const shippingAddress = new ShippingAdresseModel({
          street: session?.customer_details?.address?.line1,
          city: session?.customer_details?.address?.city,
          state: session?.customer_details?.address?.state || "N/A",
          postalCode: session?.customer_details?.address?.postal_code,
          country: session?.customer_details?.address?.country,
        })
        await shippingAddress.save()

        // Create a new order document
        const newOrder = new Order({
          userId: customer.ClientId,
          shippingAddress: shippingAddress._id,
          paymentMethod: session.payment_method_types[0],
          paymentResult: {
            id: session.payment_intent,
            status: session.payment_status,
            update_time: session.payment_intent,
            email_address: session.customer_email,
          },
          shippingPrice: session.total_details.amount_shipping / 100,
          totalPrice: session.amount_total ? session.amount_total / 100 : 0,
          status: "Pending",
          deliveredAt: null,
        })

        await newOrder.save()

        // Add orderId to each line item and save them
        const lineItemsWithOrderId = orderItems.map(item => ({
          ...item,
          orderId: newOrder._id,
        }))
        await LineOrderItems.insertMany(lineItemsWithOrderId)

        // Atomically credit each shop's balance and record the transaction
        for (const item of lineItems) {
          const shopId = item.price.product.metadata.shopId
          const productId = item.price.product.metadata.productId
          const quantityPurchased = item.quantity
          const amount = item.amount_total || 0

          if (!mongoose.Types.ObjectId.isValid(shopId)) continue

          // Atomically update the shop balance (no read-modify-write race)
          await Shop.findByIdAndUpdate(shopId, {
            $inc: { Balance: amount },
            $addToSet: { transections: newOrder._id },
          })

          // Atomically decrement stock and increment total_sell only when
          // enough stock remains (prevents overselling in concurrent orders)
          await Product.updateOne(
            {
              _id: productId,
              available_quantity: { $gte: quantityPurchased },
            },
            {
              $inc: {
                available_quantity: -quantityPurchased,
                total_sell: quantityPurchased,
              },
            }
          )
        }

        // Payment succeeded: clear the user's cart
        await Cart.findOneAndDelete({ userId: customer.ClientId })

        // Respond with success
        return res.status(200).json({ received: true })
      }

      // Acknowledge any other event type
      return res.status(200).json({ received: true })
    } catch (err) {
      console.error("Webhook error:", err.message)
      res.status(400).send(`Webhook Error: ${err.message}`)
    }
  }
)

app.use(express.json({ limit: "2mb" }))
app.use(express.urlencoded({ extended: true, limit: "2mb" }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, "public")))

app.use("/api/auth", authLimiter, authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/shop", ShopRoutes)
app.use("/api/review", ReviewRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/notifications", notificationRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" })
})

// Central error handler
app.use((err, req, res, next) => {
  if (err instanceof ErrorHandler) {
    return res.status(err.statusCode || 500).json({ message: err.message })
  }
  if (err.type === "entity.parse.failed" || err.type === "entity.too.large") {
    return res.status(400).json({ message: "Invalid or too large request body" })
  }
  console.error("Unhandled error:", err.message)
  res.status(500).json({ message: "Internal server error" })
})

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDIANRY_API_SECRET,
})

// Connect to MongoDB. If the database is unreachable at startup, log the
// error and exit with a non-zero code so the platform can restart the service
// (rather than silently running a server with no backing store).
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected")
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message)
    process.exit(1)
  })