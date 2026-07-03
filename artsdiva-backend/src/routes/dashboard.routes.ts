import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { getStatsHandler } from "../controllers/dashboard.controller";

const router: Router = Router();

router.use(authenticate);
router.get("/stats", asyncHandler(getStatsHandler));

export default router;
