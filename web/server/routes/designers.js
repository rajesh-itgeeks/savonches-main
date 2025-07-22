import { Router } from "express";
import * as controllers from "../controllers/designerController.js"
import { addDesignerValidation } from "../validations/designersValidation.js";

const router = Router();

router.post("/list", controllers.designersList);
router.post("/add", addDesignerValidation, controllers.addDesigner);
router.delete("/delete/:id", controllers.deleteDesigner);
router.put("/update/:id", addDesignerValidation, controllers.updateDesigner);

export default router;

