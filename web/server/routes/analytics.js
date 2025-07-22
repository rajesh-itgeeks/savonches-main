import { Router } from "express";
import * as controllers from '../controllers/analyticsController.js'
const router = Router();

router.get("/summary", controllers.dashboardSummary);

export default router;

