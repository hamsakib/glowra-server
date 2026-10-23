import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 3 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(ApiError.badRequest("Only JPG, PNG, WebP or AVIF images are allowed."));
  },
}).single("image");
