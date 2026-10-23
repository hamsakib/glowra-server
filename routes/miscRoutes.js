import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  createMessage,
  deleteMessage,
  getPost,
  getSettings,
  listMessages,
  listPosts,
  serveImage,
  subscribe,
  updateMessage,
  updateSettings,
  uploadImage,
} from "../controllers/miscController.js";
import { authorize, protect } from "../middleware/auth.js";
import { uploadImage as uploadMiddleware } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { contactSchema, messageStatusSchema, newsletterSchema, settingsSchema } from "../validators/schemas.js";

const router = Router();

const formLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions. Please try again in a few minutes." },
});

// Contact form
router.post("/messages", formLimiter, validate(contactSchema), createMessage);
router.get("/messages", protect, authorize("admin"), listMessages);
router.patch("/messages/:id", protect, authorize("admin"), validate(messageStatusSchema), updateMessage);
router.delete("/messages/:id", protect, authorize("admin"), deleteMessage);

// Newsletter
router.post("/newsletter", formLimiter, validate(newsletterSchema), subscribe);

// Blog
router.get("/posts", listPosts);
router.get("/posts/:slug", getPost);

// Images
router.post("/images", protect, uploadMiddleware, uploadImage);
router.get("/images/:id", serveImage);

// Store settings
router.get("/settings", getSettings);
router.put("/settings", protect, authorize("admin"), validate(settingsSchema), updateSettings);

export default router;
