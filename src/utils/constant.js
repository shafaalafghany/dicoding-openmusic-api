/* eslint-disable max-len */
module.exports = {
  getCurrentTime: () => {
    const date = new Date().toISOString();
    return date;
  },
  ERROR: (res, code, status, message) => {
    const response = res.response({
      status,
      message,
    });
    response.code(code);
    return response;
  },
  SUCCESS: (res, code, status, message, data) => {
    let result;
    if (message === '' || message == null) {
      result = {
        status,
        data,
      };
    } else if (data === '' || data == null) {
      result = {
        status,
        message,
      };
    } else {
      result = {
        status,
        message,
        data,
      };
    }
    const response = res.response(result);
    response.code(code);
    return response;
  },
};
