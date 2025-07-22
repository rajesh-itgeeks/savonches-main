import { Router } from "express";
import * as  controllers from "../controllers/notificationController.js";
import { defaultTemplateValidation, saveValidation, templateDetailsValidation, templatePreviewValidation, updateTypeValidation } from "../validations/notificationValidation.js";

const router = Router();

//for updating notification settings
router.put("/save", saveValidation, controllers.saveSettings);
//for getting notification details
router.get("/details", controllers.notificationDetails);
//for updating email type and storing for the store
router.put("/update-type", updateTypeValidation, controllers.updateType);
//for reverting email templates
router.post("/default", defaultTemplateValidation, controllers.defaultTemplate);
//for getting template details based on type
router.post("/template-details", templateDetailsValidation, controllers.templateDetails);
//for template preview
router.post("/preview", templatePreviewValidation, controllers.templatePreview);

export default router;

