import { Router } from "express";
import * as  controllers from "../controllers/storeController.js";
import { updateAppSettingsValidation } from "../validations/storeValidation.js";

const router = Router();

router.post("/info", controllers.storeInfo);
router.get("/settings", controllers.getStoreSettings);
router.put("/settings", updateAppSettingsValidation, controllers.updateStoreSettings);

export default router;

