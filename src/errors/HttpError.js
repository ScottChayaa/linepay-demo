class HttpError extends Error {
  status;
  headers;
  code;

  constructor(status, message = '', code = 0, headers = []) {
    super(message);

    this.status = status;
    this.message = message;
    this.headers = headers;
    this.code = code;
  }
}

module.exports = HttpError;