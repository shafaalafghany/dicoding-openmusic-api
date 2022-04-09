const Jwt = require('@hapi/jwt');
const InvariantError = require('../exceptions/InvariantError');
require('dotenv').config();

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifacts, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifacts.decoded;
      // console.log(artifacts.decoded)

      return payload;
    } catch (error) {
      throw new InvariantError('Token not validdd');
    }
  }
};

module.exports = TokenManager;
