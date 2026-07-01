import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { validate, validateQuery } from "../middleware/validate.middleware";
import { createLeaseSchema, listLeasesQuerySchema } from "../validators/lease.validator";
import {
  cancelLeaseHandler,
  completeLeaseHandler,
  createLeaseHandler,
  getLeaseHandler,
  listLeasesHandler,
} from "../controllers/lease.controller";

const router: Router = Router();

// No delete endpoint or ADMIN-only restriction is specified for Lease
// mutations — any logged-in user can create/complete/cancel leases.
router.use(authenticate);

router.get("/", validateQuery(listLeasesQuerySchema), asyncHandler(listLeasesHandler));
router.get("/:id", asyncHandler(getLeaseHandler));
router.post("/", validate(createLeaseSchema), asyncHandler(createLeaseHandler));
router.put("/:id/complete", asyncHandler(completeLeaseHandler));
router.put("/:id/cancel", asyncHandler(cancelLeaseHandler));

export default router;
