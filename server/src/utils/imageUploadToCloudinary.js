const multer = require("multer");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const FormData = require("form-data");

const uploadImageToImgBB = async (filePath) => {
  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(filePath));

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=228f07b239d69be9bcc9d7f97fbf57de`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    fs.unlink(filePath, (err) => {
      if (err) {
        console.error("Failed to delete local file after upload:", err);
      } else {
        console.log("Local file is deleted after ImgBB upload");
      }
    });

    return response.data;
  } catch (error) {
    console.error("ImgBB upload failed:", error);
    throw error;
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), "/uploads/");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Uploads directory created.");
    }

    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

module.exports = { upload, uploadImageToImgBB };
