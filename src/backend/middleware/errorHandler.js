const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json(err.toJSON());
  }

  if (err?.status && err?.code && err?.message) {
    const status = err.status;
    return res.status(status).json({
      error:
        status === 400 ? "Bad Request" :
        status === 401 ? "Unauthorized" :
        status === 403 ? "Forbidden" :
        status === 404 ? "Not Found" :
        status === 409 ? "Conflict" :
        status === 422 ? "Unprocessable Entity" :
        "Internal Server Error",
      message: err.message,
      code: err.code,
      ...(err.details ? { details: err.details } : {})
    });
  }

  console.error("[UNHANDLED ERROR]", err);
  return res.status(500).json({
    error: "Internal Server Error",
    message: "Ocorreu um erro inesperado",
    code: "SERVER_ERROR"
  });
}

module.exports = errorHandler;
