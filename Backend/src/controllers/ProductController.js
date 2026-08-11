const Category = require("../models/Category.js")
const Product = require("../models/Product.js")
const Review = require("../models/Review.js")
const uploadImage = require("../utils/uploadImage")
const { validationResult } = require("express-validator")
const Discount = require("../models/Discount.js")

const addOrEditProduct = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    // Use the authenticated user (from validateToken + requireSeller), never a
    // user-supplied userId, to determine the shop the product belongs to.
    const shopId =
      req.user && req.user.role === "Admin"
        ? req.body.shopId
        : req.user.shopId

    if (!shopId) {
      return res
        .status(400)
        .json({ message: "You must own a shop to add products" })
    }

    const category = await Category.findById(req.body.category)
    if (!category) {
      return res.status(400).json({ message: "Category Not Found" })
    }

    const image = req.file ? { url: await uploadImage(req.file) } : undefined

    let product
    if (req.body.status == "edit") {
      // Update existing product
      product = await Product.findById(req.body.productId)
      if (!product) {
        return res.status(404).json({ message: "Product not found" })
      }

      // A seller may only edit their own products
      if (
        req.user &&
        req.user.role !== "Admin" &&
        String(product.shopId) !== String(shopId)
      ) {
        return res.status(403).json({ message: "Forbidden" })
      }

      product.name = req.body.name
      product.categoryId = category._id
      product.shopId = shopId
      product.description = req.body.description
      product.price = req.body.price
      product.available_quantity = req.body.quantity
      if (image) {
        product.image = image
      }
      console.log(req.body.discount)

      // Check if discount option is provided
      if (req.body.discount != 0) {
        const discount = new Discount({
          discount_rate: req.body.discount,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
        })
        product.isHavingDiscount = true

        await discount.save()
        product.discountId = discount._id
      }

      await product.save()
      console.log("Product Updated")
      return res.status(200).json({ message: "Product Updated" })
    } else {
      console.log(req.body)
      // Add new product
      product = new Product({
        name: req.body.name,
        categoryId: category._id,
        shopId,
        description: req.body.description,
        price: req.body.price,
        available_quantity: req.body.quantity,
        image,
      })

      // Check if discount option is provided
      if (req.body.discount != 0) {
        const discount = new Discount({
          discount_rate: req.body.discount,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
        })
        product.isHavingDiscount = true
        await discount.save()
        product.discountId = discount._id
      }

      await product.save()
      console.log("Product Added")
      return res.status(200).json({ message: "Product Added" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("categoryId", "name")
      .populate("shopId", "name avatar")
    return res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getBestProducts = async (req, res) => {
  try {
    // Find all products that have a discount
    const products = await Product.find({ discountId: { $exists: true } })
      .populate("categoryId", "name")
      .populate("shopId", "name avatar")
      .exec()

    // Calculate the discounted price and add it as a new field
    const updatedProducts = await Promise.all(
      products.map(async product => {
        let discountedPrice = product.price

        if (product.discountId) {
          const discount = await Discount.findById(product.discountId)

          // Ensure discount is found and discount_rate is valid
          if (discount && discount.discount_rate) {
            // Calculate the discounted price
            discountedPrice =
              product.price - (product.price * discount.discount_rate) / 100
          } else {
            // Skip the product if no valid discount is found
            return null
          }
        } else {
          // Skip the product if no discountId is present
          return null
        }

        // Return the product with the new field for discounted price
        return {
          ...product.toObject(), // Convert Mongoose document to plain JavaScript object
          discountedPrice, // Add new field for the discounted price
        }
      })
    )

    // Filter out any null values resulting from products without valid discounts
    const filteredProducts = updatedProducts.filter(product => product !== null)

    return res.status(200).json(filteredProducts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getFeatureProducts = async (req, res) => {
  console.log("feature products here")
  try {
    const products = await Product.find({ discountId: { $exists: false } })
      .populate("categoryId", "name")
      .populate("shopId", "name avatar")
      .sort({ createdAt: -1 })

    return res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProductsByCategory = async (req, res) => {
  try {
    console.log("category products here")
    const productId = req.params.productId
    console.log(productId)

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    const relatedProducts = await Product.find({
      categoryId: product.categoryId,
      _id: { $ne: product._id },
    })
      .populate("categoryId", "name")
      .populate("shopId", "name avatar")
      .sort({ createdAt: -1 })
      .exec()

    console.log(relatedProducts)

    return res.status(200).json(relatedProducts)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const removeProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // A seller may only delete their own products
    if (
      req.user &&
      req.user.role !== "Admin" &&
      String(product.shopId) !== String(req.user.shopId)
    ) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await Product.findByIdAndDelete(productId)
    return res.status(200).json({ message: "Product Removed " })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId)
      .populate("categoryId", "name")
      .populate("shopId", "name avatar")

    // Get the reviews related to this product
    const Reviews = await Review.find({ productId: productId }).populate(
      "userId"
    )

    // Create a temporary field for reviews in the product object

    return res.status(200).json({ product, Reviews })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // A seller may only update their own products
    if (
      req.user &&
      req.user.role !== "Admin" &&
      String(product.shopId) !== String(req.user.shopId)
    ) {
      return res.status(403).json({ message: "Forbidden" })
    }

    // Whitelist updatable fields instead of mass-assigning the request body
    const allowedFields = [
      "name",
      "description",
      "price",
      "available_quantity",
      "Brands",
    ]
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field]
      }
    }
    if (req.file) {
      product.image = { url: await uploadImage(req.file) }
    }
    await product.save()
    return res.status(200).json({ message: "Product Updated" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  addOrEditProduct,
  getProducts,
  removeProduct,
  getProduct,
  updateProduct,
  getProductsByCategory,
  getBestProducts,
  getFeatureProducts,
}
