import mongoose from "mongoose";
import multer from "multer";
import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export function notFound(req, _res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let details = err.details;

  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    message = "Please fix the highlighted fields.";
    details = Object.fromEntries(Object.entries(err.errors).map(([key, value]) => [key, value.message]));
  } else if (err instanceof mongoose.Error.CastError) {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err?.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyValue || {})[0] || "value";
    message = `That ${field} is already in use.`;
    details = { [field]: message };
  } else if (err instanceof multer.MulterError) {
    status = 400;
    message = err.code === "LIMIT_FILE_SIZE" ? "Image must be 3 MB or smaller." : err.message;
  } else if (err?.type === "entity.parse.failed") {
    status = 400;
    message = "Request body is not valid JSON.";
  }

  if (status >= 500 && !(err instanceof ApiError)) {
    // Unexpected failure: log the stack server-side, keep the message generic in production.
    console.error(err);
    if (env.isProd) message = "Something went wrong on our side. Please try again.";
  }

  res.status(status).json({ success: false, message, ...(details ? { errors: details } : {}) });
}
