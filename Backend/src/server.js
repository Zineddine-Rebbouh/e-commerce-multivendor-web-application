const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 8000
const cookieParser = require("cookie-parser")
const mongoose = require("mongoose")
const cors = require("cors")
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
const eventRoutes = require("./routes/EventRoutes")
const notificationRoutes = require("./routes/NotificationRoutes")

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
)

app.post(
  "/webhook",
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

        // Create customer object
        const customer = {
          ClientId: session.client_reference_id,
          email: session.customer_email,
          name: session.customer_name,
        }

        // Retrieve the full session including line items
        const retrieveSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ["line_items.data.price.product"],
          }
        )

        const lineItems = retrieveSession?.line_items?.data

        // Map line items to order items
        const orderItems = lineItems?.map(item => ({
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

        // Update the shop balance for each line item
        lineItems?.forEach(async item => {
          try {
            const shopId = item.price.product.metadata.shopId
            console.log(item.price.product)
            // Update the balance for the shop
            const updatedShop = await Shop.findByIdAndUpdate(
              shopId,
              {
                $inc: {
                  Balance: item.amount_total,
                },
              },
              { new: true }
            )

            console.log(
              `Shop balance updated for shop ${shopId}: ${updatedShop.Balance}`
            )
          } catch (error) {
            console.error(`Error updating shop balance: ${error.message}`)
          }
        })

        // Update the totalSell field for each product
        lineItems?.forEach(async item => {
          try {
            const productId = item.price.product.metadata.productId
            const quantityPurchased = item.quantity

            // Retrieve the product from the database
            const product = await Product.findById(productId)

            if (product) {
              // Update the totalSell field
              product.total_sell += quantityPurchased

              // minise the quantity of the product
              product.quantity -= quantityPurchased

              // Save the updated product
              await product.save()
            } else {
              console.error(`Product with ID ${productId} not found.`)
            }
          } catch (error) {
            console.error(
              `Error updating totalSell for product: ${error.message}`
            )
          }
        })

        // Respond with success
        return res.status(200).json("Order created")
      }
    } catch (err) {
      console.log(err)
      res.status(400).send(`Webhook Error: ${err.message}`)
    }
  }
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(path.join(__dirname, "uploads")))

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/products", productsRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/shop", ShopRoutes)
app.use("/api/review", ReviewRoutes)
app.use("/api/reports", reportsRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/notifications", notificationRoutes)

// app.use("/api/orders", require("./routes/ordersRoutes"))
// app.use("/api/cart", require("./routes/cartRoutes"))
// app.use("/api/addresses", require("./routes/addressesRoutes"))
// app.use("/api/payment", require("./routes/paymentRoutes"))

// app.use(ErrorHandler)

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log("MongoDB connected")
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  })
  .catch(err => console.error("MongoDB connection error:", err))

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDIANRY_API_SECRET,
})

// Start the server
