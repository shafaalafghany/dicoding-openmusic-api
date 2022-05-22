/* eslint-disable no-underscore-dangle */
const { SUCCESS } = require('../../utils/constant');

class AuthenticationsHandler {
  constructor(authenticationsService, usersService, tokenManager, validator) {
    this._authenticationsService = authenticationsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(req, res) {
    this._validator.validatePostAuthenticationPayload(req.payload);

    const userId = await this._usersService.verifyUserCredential(req.payload);
    const accessToken = this._tokenManager.generateAccessToken({ userId });
    const refreshToken = this._tokenManager.generateRefreshToken({ userId });

    await this._authenticationsService.addRefreshToken(refreshToken);

    return SUCCESS(res, 201, 'success', 'add new token successful', { accessToken, refreshToken });
  }

  async putAuthenticationHandler(req, res) {
    this._validator.validatePutAuthenticationPayload(req.payload);
    const { refreshToken } = req.payload;

    await this._authenticationsService.verifyRefreshToken(refreshToken);
    const { userId } = await this._tokenManager.verifyRefreshToken(refreshToken);
    const accessToken = await this._tokenManager.generateAccessToken({ userId });

    return SUCCESS(res, 200, 'success', 'update token successful', { accessToken });
  }

  async deleteAuthenticationHandler(req, res) {
    this._validator.validateDeleteAuthenticationPayload(req.payload);

    const { refreshToken } = req.payload;
    await this._authenticationsService.verifyRefreshToken(refreshToken);
    await this._authenticationsService.deleteRefreshToken(refreshToken);

    return SUCCESS(res, 200, 'success', 'delete token successful');
  }
}

module.exports = AuthenticationsHandler;
