const Review = require("../models/Review")
const Product = require("../models/Product")
const uploadImage = require("../utils/uploadImage")

// @desc    Create new review
const createReview = async (req, res) => {
  const { rating, comment } = req.body
  const { id } = req.params
  const parsedRating = Number(rating)

  if (!parsedRating || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" })
  }

  try {
    const product = await Product.findById(id)

    if (product) {
      const uploadedImages = []
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const imageUrl = await uploadImage(file)
          uploadedImages.push(imageUrl)
        }
      }

      const review = new Review({
        rating: parsedRating,
        comment,
        productId: id,
        userId: req.userId,
        screenshots: uploadedImages,
      })

      await review.save()

      // Recompute product rating as the average of all reviews
      const reviews = await Review.find({ productId: id })
      const averageRating =
        reviews.length === 0
          ? parsedRating
          : reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

      product.rating = Math.round(averageRating * 10) / 10
      await product.save()

      res.status(201).json({ message: "Review added" })
    } else {
      res.status(404).json({ message: "Product not found" })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getReviews = async (req, res) => {
  const { id } = req.params

  try {
    const product = await Product.findById(id)

    if (product) {
      const reviews = await Review.find({ productId: id }).populate("userId")
      return res.status(200).json(reviews)
    }
    return res.status(404).json({ message: "Product not found" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteReview = async (req, res) => {
  const { id } = req.params

  try {
    const review = await Review.findById(id).populate("productId")

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Reviews may only be deleted by their author or an admin
    if (
      req.user &&
      req.user.role !== "Admin" &&
      String(review.userId) !== String(req.userId)
    ) {
      return res.status(403).json({ message: "Forbidden" })
    }

    await review.deleteOne()
    res.status(200).json({ message: "Review deleted" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const updateReview = async (req, res) => {
  const { id } = req.params
  const { rating, comment } = req.body

  try {
    const review = await Review.findById(id).populate("productId")

    if (!review) {
      return res.status(404).json({ message: "Review not found" })
    }

    // Reviews may only be updated by their author or an admin
    if (
      req.user &&
      req.user.role !== "Admin" &&
      String(review.userId) !== String(req.userId)
    ) {
      return res.status(403).json({ message: "Forbidden" })
    }

    if (rating !== undefined) review.rating = rating
    if (comment !== undefined) review.comment = comment

    await review.save()
    res.status(200).json({ message: "Review updated" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { createReview, getReviews, deleteReview, updateReview }