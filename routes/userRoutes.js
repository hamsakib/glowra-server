import { Router } from "express";
import {
  adminUpdateUser,
  changePassword,
  deleteUser,
  getUser,
  listUsers,
  updatePreferences,
  updateProfile,
} from "../controllers/userController.js";
import { authorize, protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { passwordChangeSchema, preferencesSchema, profileSchema, userAdminSchema } from "../validators/schemas.js";

const router = Router();

router.use(protect);
router.patch("/me", validate(profileSchema), updateProfile);
router.patch("/me/preferences", validate(preferencesSchema), updatePreferences);
router.patch("/me/password", validate(passwordChangeSchema), changePassword);

router.get("/", authorize("admin"), listUsers);
router.get("/:id", authorize("admin"), getUser);
router.patch("/:id", authorize("admin"), validate(userAdminSchema), adminUpdateUser);
router.delete("/:id", authorize("admin"), deleteUser);

export default router;
