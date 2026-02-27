// central error handler middleware
module.exports = (err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Server Error",
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
  });
};