const ErrorCode = require('@/errors/ErrorCode');

class HttpCodeError extends Error {
  status;
  headers;
  code;

  constructor(status, code = 0, headers = []) {
    let message = ErrorCode.GetMessage(code);

    super(message);

    this.status = status;
    this.message = message;
    this.headers = headers;
    this.code = code;
  }
}

module.exports = HttpCodeError;
