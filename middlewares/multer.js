const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("multer");
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Postpics", // Optional: set a folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed image formats
  },
});
const storageforavatar = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Profilepics", // Optional: set a folder name in your Cloudinary account
    allowed_formats: ["jpg", "png", "jpeg"], // Allowed image formats
  },
});
const upload = multer({
  storage,
});
const uploadforavatar = multer({
  storageforavatar,
});

module.exports = upload;
