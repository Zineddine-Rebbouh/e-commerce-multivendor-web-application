const multer = require("multer")

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/bmp",
])

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.has(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed"))
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
  fileFilter: fileFilter,
})

module.exports = upload