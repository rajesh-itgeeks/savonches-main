import { Router } from "express";
import * as  controllers from "../controllers/productTypeController.js";
import { addTypeValidation, updateProductTypeValidation } from "../validations/productTypeValidation.js";

const router = Router();

router.post("/list", controllers.productTypesList);
router.post("/add", addTypeValidation, controllers.addType);
router.delete("/delete/:id", controllers.removeType);
router.put("/update/:id", updateProductTypeValidation, controllers.updateType);

export default router;

