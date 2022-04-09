/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */
const ClientError = require('../../exceptions/ClientError');
const { SUCCESS, ERROR } = require('../../utils/constant');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAddUserHandler = this.postAddUserHandler.bind(this);
  }

  async postAddUserHandler(req, res) {
    try {
      this._validator.validateUserPayload(req.payload);

      const userId = await this._service.addUser(req.payload);

      return SUCCESS(res, 201, 'success', 'add new user successful', { userId });
    } catch (error) {
      if (error instanceof ClientError) {
        return ERROR(res, 400, 'fail', error.message);
      }

      return ERROR(res, 500, 'error', error.message);
    }
  }
}

module.exports = UsersHandler;
