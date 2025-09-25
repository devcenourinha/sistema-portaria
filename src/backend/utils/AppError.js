class AppError extends Error {
  constructor(message, { status = 500, code = "SERVER_ERROR", details = null } = {}) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
    this.details = details;
    Error.captureStackTrace?.(this, this.constructor);
  }
  toJSON() {
    return {
      error:
        this.status === 400 ? "Bad Request" :
        this.status === 401 ? "Unauthorized" :
        this.status === 403 ? "Forbidden" :
        this.status === 404 ? "Not Found" :
        this.status === 409 ? "Conflict" :
        this.status === 422 ? "Unprocessable Entity" :
        "Internal Server Error",
      message: this.message,
      code: this.code,
      ...(this.details ? { details: this.details } : {})
    };
  }
}
module.exports = AppError;
