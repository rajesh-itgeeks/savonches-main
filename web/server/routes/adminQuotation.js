import { Router } from "express";
import multer from "multer";
import * as  controllers from "../controllers/quotationController.js";
import { listValidation, adminUpdateValidation } from "../validations/quotationValidation.js";

const router = Router();

// admin routes
router.put("/update/:id", adminUpdateValidation, controllers.adminUpdateQuote);
router.post("/list", listValidation, controllers.quotationList);
router.get("/:id", controllers.getQuoteById);

export default router;

