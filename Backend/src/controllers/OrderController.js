const LineOrderItems = require("../models/LineOrderItems")
const Order = require("../models/Order")
const Product = require("../models/Product")

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({
        createdAt: -1,
      })
      .populate("userId", "name email")
    res.status(200).json({ orders })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name email")
      .populate("shippingAddress")

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // A customer may view only their own order
    if (req.user && req.user.role !== "Admin") {
      const isSellerInOrder = await LineOrderItems.exists({
        orderId: order._id,
        productId: {
          $in: await Product.find({ shopId: req.user.shopId }).select("_id"),
        },
      })
      if (
        String(order.userId) !== String(req.userId) &&
        !isSellerInOrder
      ) {
        return res.status(403).json({ message: "Forbidden" })
      }
    }

    const items = await LineOrderItems.find({
      orderId: order._id,
    }).populate("productId")

    const productInfos = items.map(item => ({
      ...item.productId.toObject(),
      quantity: item.quantity,
    }))

    const orderWithProductInfos = { ...order.toObject(), items: productInfos }
    res.status(200).json(orderWithProductInfos)
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const getOrderByUserId = async (req, res) => {
  try {
    // A non-admin may only fetch their own orders
    if (req.user && req.user.role !== "Admin" && req.params.id !== req.userId) {
      return res.status(403).json({ message: "Forbidden" })
    }

    const orders = await Order.find({ userId: req.params.id }).sort({
      createdAt: -1,
    })

    if (!orders.length) {
      return res.status(200).json([])
    }

    // Single batched query for all line items of a user's orders (no N+1)
    const orderIds = orders.map(order => order._id)
    const allItems = await LineOrderItems.find({
      orderId: { $in: orderIds },
    }).populate("productId")

    const ordersWithItems = orders.map(order => {
      const items = allItems
        .filter(item => String(item.orderId) === String(order._id))
        .map(item => ({ ...item.productId.toObject(), quantity: item.quantity }))

      return {
        ...order.toObject(),
        items,
        productIds: items.map(item => item._id),
      }
    })

    res.status(200).json(ordersWithItems)
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ message: error.message })
  }
}

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const validStatuses = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
      "On Hold",
      "Refunded",
      "Returned",
    ]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" })
    }

    const order = await Order.findById(req.params.id)

    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Only an admin, the customer who owns the order, or a seller whose
    // products are in the order may update its status.
    if (req.user && req.user.role !== "Admin") {
      const ownsOrder = String(order.userId) === String(req.userId)
      const isSellerInOrder = req.user.shopId
        ? await LineOrderItems.exists({
            orderId: order._id,
            productId: {
              $in: await Product.find({ shopId: req.user.shopId }).select(
                "_id"
              ),
            },
          })
        : false

      if (!ownsOrder && !isSellerInOrder) {
        return res.status(403).json({ message: "Forbidden" })
      }
    }

    order.status = status
    await order.save()

    res.status(200).json({ message: "Order status updated successfully" })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ message: error.message })
  }
}

module.exports = { getOrders, getOrder, getOrderByUserId, updateOrderStatus }