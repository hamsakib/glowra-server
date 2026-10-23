import { Router } from "express";
import authRoutes from "./authRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import miscRoutes from "./miscRoutes.js";
import orderRoutes from "./orderRoutes.js";
import productRoutes from "./productRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import statsRoutes from "./statsRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.get("/health", (_req, res) => res.json({ success: true, status: "ok", time: new Date().toISOString() }));

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/reviews", reviewRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/stats", statsRoutes);
router.use("/", miscRoutes);

export default router;
