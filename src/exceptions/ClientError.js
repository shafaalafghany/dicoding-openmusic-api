class ClientError extends Error{
  constructor(message, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
    this.name = 'ClientError';
  }
}

module.exports = ClientError;
