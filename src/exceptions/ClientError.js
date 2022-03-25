/* eslint-disable no-this-before-super */
/* eslint-disable constructor-super */
class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
