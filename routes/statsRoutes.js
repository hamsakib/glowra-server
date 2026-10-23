import { Router } from "express";
import { adminStats, myStats, publicStats } from "../controllers/statsController.js";
import { authorize, protect } from "../middleware/auth.js";

const router = Router();

router.get("/public", publicStats);
router.get("/me", protect, myStats);
router.get("/admin", protect, authorize("admin"), adminStats);

export default router;
