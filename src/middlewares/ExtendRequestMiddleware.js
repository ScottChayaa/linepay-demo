const validate = require('@/helpers/validate');

function ExtendRequestMiddleware(req, res, next) {
  // req.user = 'scott';
  req.validate = validate; 
  next();
}

module.exports = ExtendRequestMiddleware;
