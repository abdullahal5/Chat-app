const {
  createChat,
  getAllChat,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../../controller/chat/chatController");
const protect = require("../../middleware/auth");

const router = require("express").Router();

router.post("/create-chat", protect(), createChat);
router.get("/get-all-chat", protect(), getAllChat);
router.post("/create-group-chat", protect(), createGroupChat);
router.post("/rename-group", protect(), renameGroup);
router.post("/remove-from-group", protect(), removeFromGroup);
router.post("/add-to-group", protect(), addToGroup);

module.exports = router;
