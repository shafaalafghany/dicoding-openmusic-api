const { SUCCESS } = require('../../utils/constant');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAddUserHandler = this.postAddUserHandler.bind(this);
  }

  async postAddUserHandler(req, res) {
    this._validator.validateUserPayload(req.payload);

    const userId = await this._service.addUser(req.payload);

    return SUCCESS(res, 201, 'success', 'add new user successful', { userId });
  }
}

module.exports = UsersHandler;
