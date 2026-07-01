import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validateQuery } from "../middleware/validate.middleware";
import { searchQuerySchema } from "../validators/search.validator";
import { searchHandler } from "../controllers/search.controller";

const router: Router = Router();

router.use(authenticate);
router.get("/", validateQuery(searchQuerySchema), asyncHandler(searchHandler));

export default router;
