import { Router } from "express";
import {
  adminPatchProduct,
  createProduct,
  deleteProduct,
  featuredProducts,
  filterOptions,
  getProduct,
  getProductForEdit,
  listProducts,
  relatedProducts,
  tableProducts,
  updateProduct,
} from "../controllers/productController.js";
import { authorize, optionalAuth, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { adminProductPatchSchema, productSchema } from "../validators/schemas.js";

const router = Router();

// Public
router.get("/", listProducts);
router.get("/featured", featuredProducts);
router.get("/filters", filterOptions);

// Signed-in sellers and admins
router.get("/mine", protect, (req, res) => tableProducts(req, res, "mine"));
router.get("/admin/all", protect, authorize("admin"), (req, res) => tableProducts(req, res, "all"));
router.get("/id/:id", protect, getProductForEdit);
router.post("/", protect, validate(productSchema), createProduct);
router.put("/:id", protect, validate(productSchema), updateProduct);
router.patch("/:id/admin", protect, authorize("admin"), validate(adminProductPatchSchema), adminPatchProduct);
router.delete("/:id", protect, deleteProduct);

// Public detail routes last so they don't shadow the ones above
router.get("/:slug", optionalAuth, getProduct);
router.get("/:slug/related", relatedProducts);

export default router;
