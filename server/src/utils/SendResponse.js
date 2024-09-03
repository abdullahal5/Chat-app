const SendResponse = (res, data,) => {
  res.status(data?.statusCode).json({
    success: data.success,
    message: data.message,
    data: data.data,
    token: data.token
  });
};

module.exports = SendResponse