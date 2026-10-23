import { Router } from "express";
import { canReview, createReview, deleteReview, listReviews, topReviews } from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { reviewSchema } from "../validators/schemas.js";

const router = Router();

router.get("/top", topReviews);
router.get("/product/:productId", listReviews);
router.get("/product/:productId/eligibility", protect, canReview);
router.post("/product/:productId", protect, validate(reviewSchema), createReview);
router.delete("/:id", protect, deleteReview);

export default router;
