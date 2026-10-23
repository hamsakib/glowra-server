import mongoose from "mongoose";
import { ApiError } from "./ApiError.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function escapeRegex(text) {
  return String(text).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role, name: user.name }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

/** Reads page/limit from a query object and returns safe numbers. */
export function paging(query, defaultLimit = 12, maxLimit = 50) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
}

export function pageMeta(total, page, limit) {
  return { total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

/** Whitelisted sort: `sort=price` or `sort=-price`. */
export function sortFrom(value, allowed, fallback) {
  if (!value) return fallback;
  const field = value.replace(/^-/, "");
  if (!allowed.includes(field)) return fallback;
  return { [field]: value.startsWith("-") ? -1 : 1 };
}

/** Converts a string to an ObjectId, or throws a 400 for malformed ids. */
export function toObjectId(id) {
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest("Invalid id");
  return new mongoose.Types.ObjectId(String(id));
}
