import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { ApiError } from "../utils/ApiError.js";

function readToken(req) {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
}

async function userFromToken(token) {
  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw new ApiError(401, "Your session has expired. Please log in again.");
    }
    throw ApiError.unauthorized("Invalid session. Please log in again.");
  }
  const user = await User.findById(payload.sub);
  if (!user) throw ApiError.unauthorized("This account no longer exists.");
  if (user.status === "blocked") throw ApiError.forbidden("This account has been blocked.");
  return user;
}

/** Requires a valid JWT. Sets req.user. */
export async function protect(req, _res, next) {
  const token = readToken(req);
  if (!token) throw ApiError.unauthorized();
  req.user = await userFromToken(token);
  next();
}

/** Sets req.user when a valid token is present, otherwise continues as a guest. */
export async function optionalAuth(req, _res, next) {
  const token = readToken(req);
  if (token) {
    try {
      req.user = await userFromToken(token);
    } catch {
      req.user = undefined;
    }
  }
  next();
}

/** Role-based access control. Use after `protect`. */
export function authorize(...roles) {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw ApiError.forbidden();
    }
    next();
  };
}
