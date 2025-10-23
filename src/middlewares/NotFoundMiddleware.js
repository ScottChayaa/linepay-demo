function NotFoundMiddleware(req, res, next) {
  return res.status(404).json({
    error: 'Not Found',
  });
}

module.exports = NotFoundMiddleware;
