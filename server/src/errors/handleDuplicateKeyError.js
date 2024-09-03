const handleDuplicateError = (err) => {
  const match = err.message.match(/"([^"]*)"/);
  const extracted_msg = match && match[1];

  const errorSources = [
    {
      path: "",
      message: `${extracted_msg} is all ready exists !!!`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Invalid ID",
    errorSources,
  };
};

module.exports = handleDuplicateError;
