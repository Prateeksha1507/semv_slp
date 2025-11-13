import { Router } from "express";
import { donationRequestController } from "../controllers/donationRequestController.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = Router();

// Get all donation requests (Admin only)
router.get("/", authMiddleware, adminMiddleware, donationRequestController.getAllDonationRequests);

// Approve or reject donation requests
router.patch("/:status/:id", authMiddleware, adminMiddleware, donationRequestController.updateDonationRequest);

export default router;
