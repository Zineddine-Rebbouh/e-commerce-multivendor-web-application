const User = require("../models/User")
const Shop = require("../models/Shop")
const Cart = require("../models/Cart")
const Product = require("../models/Product")
const LineOrderItems = require("../models/LineOrderItems")
const LineCartItems = require("../models/LineCartItems")
const Order = require("../models/Order")
const Whishlist = require("../models/Whishlist")
const uploadImage = require("../utils/uploadImage")
const Notification = require("../models/Notification")

const getCurrentUserUser = async (req, res) => {
  let shop
  try {
    const user = await User.findById(req.userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" })
    }

    if (user.shopId) {
      shop = await Shop.findOne({ _id: user.shopId })
    }

    user.shop = shop

    res.status(200).json({ user: user })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const getUser = async (req, res) => {
  try {
    // Only an admin (or the user themself) may view a profile
    if (req.user && req.user.role !== "Admin" && req.params.id !== req.userId) {
      return res.status(403).json({ message: "Forbidden" })
    }

    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("shopId")

    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" })
    }

    res.status(200).json({ user: user })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["Customer", "Seller"] } })
      .select("-password")
      .sort({ createdAt: -1 })
    res.status(200).json({ users })
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json("User not found")
    }

    console.log(user)
    if (user.role === "Seller") {
      const shop = await Shop.findOne({ userId: req.userId })

      if (shop) {
        await shop.deleteOne()
      }
    }

    await user.deleteOne()

    res.status(200).json("User deleted")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json("User not found")
    }

    if (String(user._id) === String(req.userId)) {
      return res.status(400).json("You cannot delete your own account here")
    }

    if (user.role === "Seller" && user.shopId) {
      await Shop.findByIdAndDelete(user.shopId)
      await Product.deleteMany({ shopId: user.shopId })
    }

    await user.deleteOne()

    res.status(200).json("User deleted")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const addToCart = async (req, res) => {
  try {
    console.log(req.userId)
    let cart = await Cart.findOne({ userId: req.userId })
    console.log(cart)
    const cartItems = req.body
    console.log(cartItems)

    // If no cart exists for the user, create one
    if (!cart) {
      cart = await Cart.create({ userId: req.userId })
    }

    // create cartItem
    for (let item of cartItems) {
      // Check if the product already exists in the cart
      const existingCartItem = await LineCartItems.findOne({
        cartId: cart._id,
        productId: item._id,
      })

      if (existingCartItem) {
        // If the product already exists in the cart, send an error message
        return res.status(400).json("Product already exists in the cart")
      } else {
        // If the product does not exist in the cart, add it
        await LineCartItems.create({
          productId: item._id,
          cartId: cart._id,
          quantity: item.quantity,
        })
      }
    }

    // create a notification
    await Notification.create({
      userId: req.userId,
      type: "cartUpdate",
      message: "Product added to cart",
    })

    res.status(200).json("Product added to cart")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const addWhislist = async (req, res) => {
  try {
    const wishlistItems = req.body

    // If no whislist exists for the user, create one

    // create whislistItem
    for (let item of wishlistItems) {
      // Check if the product already exists in the whislist
      const existingWhislistItem = await Whishlist.findOne({
        userId: req.userId,
        productId: item._id,
      })

      if (existingWhislistItem) {
        // If the product already exists in the whislist, send an error message
        return res.status(400).json("Product already exists in the whislist")
      } else {
        // If the product does not exist in the whislist, add it
        await Whishlist.create({
          productId: item._id,
          userId: req.userId,
        })
      }
    }

    await Notification.create({
      userId: req.userId,
      type: "wishlistUpdate",
      message: "Product added to whislist",
    })
    res.status(200).json("Product added to whislist")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body

    const cart = await Cart.findOne({ userId: req.userId })

    const cartItem = await LineCartItems.findOne({
      cartId: cart._id,
      productId: productId,
    })

    cartItem.quantity = quantity

    await cartItem.save()

    res.status(200).json("Cart updated")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const removeFromCart = async (req, res) => {
  try {
    const productId = req.params.id
    console.log("productId is: ", productId)
    const cartId = await Cart.findOne({ userId: req.userId })

    console.log("cartId is: ", cartId)

    await LineCartItems.findOneAndDelete({
      cartId: cartId,
      productId: productId,
    })

    res.status(200).json("Product removed from cart")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const removeFromWhislist = async (req, res) => {
  try {
    await Whishlist.findOneAndDelete({
      userId: req.userId,
      productId: req.params.id,
    })

    // user.whislist = user.whislist.filter(id => id !== productId)

    res.status(200).json("Product removed from whislist")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const getUserCartItems = async (req, res) => {
  try {
    console.log("hhhhhhhhhh")
    console.log(req.userId)
    const cart = await Cart.findOne({ userId: req.userId })
    console.log(cart)

    if (!cart) {
      return res.status(200).json([])
    }

    // retrieve all the items of this cart from the lineCartItems
    // collection and send it as a response
    let items = await LineCartItems.find({
      cartId: cart._id.toString(),
    }).populate({
      path: "productId",
      populate: {
        path: "discountId",
      },
    })

    // map over the items and return only the product data
    items = items.map(item => ({
      ...item.productId._doc,
      quantity: item.quantity,
    }))

    console.log(cart)
    res.status(200).json(items)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: error.message })
  }
}

const refundOrder = async (req, res) => {
  try {
    const { orderId } = req.body

    const order = await Order.findById(orderId)

    if (!order) {
      return res.status(404).json("Order not found")
    }

    // Check if the order has already been refunded
    if (order.status === "Refunded") {
      return res.status(400).json("Order already refunded")
    }

    if (order.status === "Delivered") {
      return res.status(400).json("Order already delivered")
    }

    // Update the order status to refunded

    //check if the orders didnt pass the limit of 7 days
    const currentDate = new Date()
    const orderDate = new Date(order.createdAt)
    const diffTime = Math.abs(currentDate - orderDate)

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 7) {
      return res.status(400).json("Order can't be refunded after 7 days")
    }

    order.status = "Refunded"
    await order.save()

    res.status(200).json("Order refunded")
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const getUserWhilistItems = async (req, res) => {
  try {
    const WhishlistItems = await Whishlist.find({
      userId: req.userId,
    }).populate("productId")

    if (!WhishlistItems) {
      return res.status(404).json([])
    }

    // Map over the WhishlistItems array and return only the productId field
    const productInfos = WhishlistItems.map(item => item.productId)

    res.status(200).json(productInfos)
  } catch (error) {
    console.error(error.message)
    return res.status(500).json({ error: error.message })
  }
}

const updateUserInformation = async (req, res) => {
  try {
    console.log("Body:", req.body)
    console.log("User ID:", req.userId)

    const userInfo = await User.findById(req.userId)

    let avatar
    if (req.file) {
      avatar = await uploadImage(req.file)
      req.body.avatar = avatar
    }

    const updateData = {
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      avatar: req.body.avatar ? req.body.avatar : userInfo.avatar,
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    })

    console.log("Updated User:", user)

    if (!user) {
      return res.status(404).json("User not found")
    }

    res.status(200).json({ user })
  } catch (error) {
    console.error("Error:", error.message)
    return res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getUser,
  getUsers,
  getUserWhilistItems,
  getCurrentUserUser,
  deleteUser,
  deleteUserById,
  addToCart,
  updateCart,
  getUserCartItems,
  addWhislist,
  removeFromCart,
  removeFromWhislist,
  refundOrder,
  updateUserInformation,
}
