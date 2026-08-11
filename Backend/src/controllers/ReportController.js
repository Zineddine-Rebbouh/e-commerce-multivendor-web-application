const Product = require("../models/Product")
const Reports = require("../models/Reports")
const User = require("../models/User")
const uploadImage = require("../utils/uploadImage")

const getReports = async (req, res) => {
  try {
    const reports = await Reports.find()
      .populate("reportedUserId")
      .populate("reporterUserId")

    if (!reports) {
      console.log("Reports Not Found")
      return res.status(404).json("Reports Not Found")
    }
    return res.status(200).json(reports)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error.message)
  }
}

const createReport = async (req, res) => {
  try {
    const { productId, reason } = req.body

    const product = await Product.findById(productId).populate(
      "shopId",
      "userId"
    )

    const reportedUser = await User.findById(product.shopId.userId)
    const uploadedImages = []
    console.log(req.files)
    for (const file of req.files) {
      const imageUrl = await uploadImage(file)
      uploadedImages.push(imageUrl)
    }

    const report = new Reports({
      reportedUserId: reportedUser._id,
      reporterUserId: req.userId,
      screenshots: uploadedImages,
      reason,
    })
    await report.save()
    return res.status(200).json(report)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error.message)
  }
}

const deleteReport = async (req, res) => {
  try {
    const { id } = req.params
    const report = await Reports.findByIdAndDelete(id)
    if (!report) {
      console.log("Report Not Found")
      return res.status(404).json("Report Not Found")
    }
    return res.status(200).json(report)
  } catch (error) {
    console.log(error)
    return res.status(500).json(error.message)
  }
}

module.exports = {
  getReports,
  deleteReport,
  createReport,
}
