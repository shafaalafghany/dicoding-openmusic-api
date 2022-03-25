/* eslint-disable constructor-super */
/* eslint-disable no-this-before-super */
class ServerError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = 'ServerError';
  }
}

module.exports = ServerError;
