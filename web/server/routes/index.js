import { Router } from "express";
import adminQuotationRoutes from "./adminQuotation.js";
import customerQuotationRoutes from "./customerQuotation.js";
import notificationRoutes from "./notification.js";
import typeRoutes from "./productTypes.js";
import designerRoutes from "./designers.js";
import analyticsRoutes from "./analytics.js";
import storeRoutes from "./store.js"
const router = Router();

// admin routes
router.use("/store", storeRoutes);
router.use("/admin-quote", adminQuotationRoutes);
router.use("/notification", notificationRoutes);
router.use("/types", typeRoutes);
router.use("/designers", designerRoutes);
router.use("/analytics", analyticsRoutes);

// external shopify routes
router.use("/customer-quote", customerQuotationRoutes);

export default router;
