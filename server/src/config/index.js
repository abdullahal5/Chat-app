const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  Jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  Jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  Jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  Jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  ImgBB_api_key: process.env.ImgBB_api_key,
};

module.exports = config;
