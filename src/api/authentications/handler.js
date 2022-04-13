/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const { SUCCESS, ERROR } = require('../../utils/constant');

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
    try {
      this._validator.validatePostAuthenticationPayload(req.payload);

      const userId = await this._usersService.verifyUserCredential(req.payload);
      const accessToken = this._tokenManager.generateAccessToken({ userId });
      const refreshToken = this._tokenManager.generateRefreshToken({ userId });

      await this._authenticationsService.addRefreshToken(refreshToken);

      return SUCCESS(res, 201, 'success', 'add new token successful', { accessToken, refreshToken });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async putAuthenticationHandler(req, res) {
    try {
      this._validator.validatePutAuthenticationPayload(req.payload);
      const { refreshToken } = req.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      const { userId } = await this._tokenManager.verifyRefreshToken(refreshToken);
      const accessToken = await this._tokenManager.generateAccessToken({ userId });

      return SUCCESS(res, 200, 'success', 'update token successful', { accessToken });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }

  async deleteAuthenticationHandler(req, res) {
    try {
      this._validator.validateDeleteAuthenticationPayload(req.payload);

      const { refreshToken } = req.payload;
      await this._authenticationsService.verifyRefreshToken(refreshToken);
      await this._authenticationsService.deleteRefreshToken(refreshToken);

      return SUCCESS(res, 200, 'success', 'delete token successful');
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, error.statusCode, 'fail', error.message);
      }

      return ERROR(res, error.statusCode, 'error', error.message);
    }
  }
}

module.exports = AuthenticationsHandler;
