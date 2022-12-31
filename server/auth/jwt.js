const jwt = require('jsonwebtoken');


const decodeToken = (token) => {
  const codedToken = token.split(' ')[1];
  return jwt.decode(codedToken);
};

module.exports = { decodeToken };