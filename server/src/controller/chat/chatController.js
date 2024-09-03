const httpStatus = require("http-status");
const AppError = require("../../errors/AppError");
const Chat = require("../../model/chatModel");
const User = require("../../model/userModel");
const catchAsync = require("../../utils/catchAsync");
const SendResponse = require("../../utils/SendResponse");

const createChat = catchAsync(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "User param not sent with request"
    );
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user.userId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "message sent",
      data: isChat[0],
    });
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.userId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      SendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "message sent",
        data: fullChat,
      });
    } catch (error) {
      throw new AppError(httpStatus.NOT_FOUND, error.message);
    }
  }
});

const getAllChat = catchAsync(async (req, res) => {
  try {
    await Chat.find({
      users: { $elemMatch: { $eq: req.user.userId } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ createdAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });

        SendResponse(res, {
          statusCode: httpStatus.OK,
          success: true,
          message: "message retrieved successfully",
          data: results,
        });
      });
  } catch (error) {
    throw new AppError(httpStatus.NOT_FOUND, error.message);
  }
});

const createGroupChat = catchAsync(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please fill all the fields");
  }

  const users = JSON.parse(req.body.users);

  if (users.length < 2) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "More than 2 users are required to form a group chat"
    );
  }

  users.push(req.user?.userId);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user?.userId,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    SendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Group chat created successfully",
      data: fullGroupChat,
    });
  } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

const renameGroup = catchAsync(async (req, res) => {
  const { chatId, chatName } = req.body;

  const isGroupChat = await Chat.findOne({ _id: chatId });

  if (isGroupChat.isGroupChat === false) {
    throw new AppError(httpStatus.BAD_REQUEST, "This chat is not a group chat");
  }

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    throw new AppError(httpStatus.NOT_FOUND, "Chat not fount");
  }

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Group remname successfully",
    data: updatedChat,
  });
});

const removeFromGroup = catchAsync(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    throw new AppError(httpStatus.NOT_FOUND, "Chat not fount");
  }

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member removed successfully",
    data: added,
  });
});

const addToGroup = catchAsync(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    throw new AppError(httpStatus.NOT_FOUND, "Chat not fount");
  }

  SendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Member added successfully",
    data: added,
  });
});

module.exports = {
  createChat,
  getAllChat,
  createGroupChat,
  renameGroup,
  removeFromGroup,
  addToGroup,
};
