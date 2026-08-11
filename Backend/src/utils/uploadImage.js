const cloudinary = require("cloudinary").v2

const uploadImage = async file => {
  try {
    // Upload the file (buffer or path) to Cloudinary and return its URL
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        (error, uploadResult) => {
          if (error) {
            console.error("Error uploading image to Cloudinary:", error)
            return reject(error)
          }
          resolve(uploadResult)
        }
      )
      stream.end(file.buffer || file.path)
    })

    return result.secure_url
  } catch (error) {
    throw error
  }
}

module.exports = uploadImage