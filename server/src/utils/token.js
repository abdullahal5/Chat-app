const jwt = require("jsonwebtoken");

const createToken = (JwtPayload, secret, expiresIn) => {
  return jwt.sign(JwtPayload, secret, {
    expiresIn,
  });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  createToken,
  verifyToken,
};
