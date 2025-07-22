import { Router } from "express";
import multer from "multer";
import * as  controllers from "../controllers/quotationController.js";
import { quotationValidation, customerUpdateValidation, customerQuotationListValidation } from "../validations/quotationValidation.js";

const storage = multer.memoryStorage(); // Save the file as a buffer
const uploads = multer({ storage: storage });

const router = Router();
// customer routes
router.post("/submit", uploads.any(), quotationValidation, controllers.submitQuote);
router.post("/list", customerQuotationListValidation, controllers.allCustomerQuotations);
router.get("/:id", controllers.getQuoteById);
router.put("/update", customerUpdateValidation, controllers.customerUpdateQuote);
router.get("/types-list", controllers.productTypesList);


export default router;

