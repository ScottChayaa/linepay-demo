const jwt = require('jsonwebtoken');

const config = require('@/configs/config');

function AuthMiddleware(req, res, next) {
  let token = '';
  
  let auths = (req.headers['authorization'] ?? '').split(' ');
  token = auths[1];

  if (token == undefined || auths[0] != "Bearer") {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, config.JWT_SECRET, function (err, jwtPayload) {
    if (err) {
      console.error(err);
      return res.status(401).json({ message: 'Unauthorized' });
    } else {
      req.user = jwtPayload;
      next();
    }
  });
}

module.exports = AuthMiddleware;
