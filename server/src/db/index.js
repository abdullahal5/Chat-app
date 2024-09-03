const mongoose = require("mongoose");
const config = require("../config");
// const AppError = require("../errors/AppError");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      config.database_url,
      {
        dbName: "Chat-app",
      } 
    );
    console.log(`MongoDB connected ${conn.connection.host}`);
  } catch (error) {
    console.log(error.message);
    // if(error.message=== "Server selection timed out after 30000 ms"){
    //   throw new AppError(
    //     httpStatus.NOT_FOUND,
    //     "Network Error"
    //   );
    // }
  }
};

module.exports = connectDB;
