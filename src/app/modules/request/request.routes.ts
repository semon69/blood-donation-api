import express from "express";
import { requestController } from "./request.controller";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { requestValidation } from "./request.validation";

const router = express.Router();

router.post(
  "/donation-request",
  validateRequest(requestValidation.RequestSchema),
  auth(),
  requestController.donationRequest
);

router.get("/donation-request", auth(), requestController.myDonations);

router.put(
  "/donation-request/:requestId",
  validateRequest(requestValidation.RequestStatusSchema),
  auth(),
  requestController.updatedDonationStatus
);

export const RequestRoutes = router;
