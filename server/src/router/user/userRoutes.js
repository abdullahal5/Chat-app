const {
  registerUser,
  loginUser,
  allUser,
  refreshToken,
} = require("../../controller/user/userController");
const protect = require("../../middleware/auth");
const { upload } = require("../../utils/imageUploadToCloudinary");

const router = require("express").Router();

router.post("/create-user", upload.single("file"), registerUser);
router.post("/login", loginUser);
router.get("/get-all-user", protect("admin"), allUser);
router.post("/refresh-token", refreshToken);

module.exports = router;
