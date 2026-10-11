export function notFound(req, res) {
  res.status(404).json({ success: false, error: { message: `Route not found: ${req.method} ${req.originalUrl}` } });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  let status = error.status || 500;
  let message = error.message || 'An unexpected error occurred.';
  let details;
  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Please check the submitted expense.';
    details = Object.values(error.errors).map((item) => item.message);
  } else if (error.name === 'CastError') {
    status = 400;
    message = 'Invalid expense ID.';
  } else if (error.code === 11000) {
    status = 409;
    message = 'An expense with these details already exists.';
  }
  res.status(status).json({ success: false, error: { message, ...(details ? { details } : {}) } });
}
