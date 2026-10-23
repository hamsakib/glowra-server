import { Router } from "express";
import { allOrders, cancelMyOrder, createOrder, getOrder, myOrders, updateOrderStatus } from "../controllers/orderController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { orderSchema, orderStatusSchema } from "../validators/schemas.js";

const router = Router();

router.use(protect);
router.post("/", validate(orderSchema), createOrder);
router.get("/mine", myOrders);
router.get("/", authorize("admin"), allOrders);
router.get("/:id", getOrder);
router.patch("/:id/cancel", cancelMyOrder);
router.patch("/:id/status", authorize("admin"), validate(orderStatusSchema), updateOrderStatus);

export default router;
