import { Router } from "express";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../controllers/categoryController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { categorySchema } from "../validators/schemas.js";

const router = Router();

router.get("/", listCategories);
router.post("/", protect, authorize("admin"), validate(categorySchema), createCategory);
router.put("/:id", protect, authorize("admin"), validate(categorySchema), updateCategory);
router.delete("/:id", protect, authorize("admin"), deleteCategory);

export default router;
