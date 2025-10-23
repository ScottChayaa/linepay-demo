const HttpError = require('@/errors/HttpError');
const HttpCodeError = require('@/errors/HttpCodeError');
const ValidationError = require('@/errors/ValidationError');
const ErrorCode = require('@/errors/ErrorCode');
const logger = require('@/helpers/Logger');
const config = require('@/configs/config');

function ErrorMiddleware(err, req, res, next) {
  let status = 500;
  let errors = {};

  if (err instanceof HttpError || err instanceof HttpCodeError) {
    status = err.status;
    errors.code = err.code;
    errors.message = err.message;
  } else if (err instanceof ValidationError) {
    status = 422;
    errors.code = err.code;
    errors.message = ErrorCode.GetMessage(err.code);
    errors.errors = err.errors;
//   } else if (err instanceof AuthenticationError) {
//     status = 401;
//     errors.code = 9003;
//     errors.message = error_codes[9003];
  } else {
    status = 500;
    errors.message = 'Internal Server Error';
  }

  errors.error_stack = err.stack?.split('\n') ?? [],
  

  res.status(status).json(errors);
  logger.error(errors);
}

module.exports = ErrorMiddleware;
