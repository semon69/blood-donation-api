import express from "express";
import { requestController } from "./request.controller";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { requestValidation } from "./request.validation";

const router = express.Router();

router.post(
  "/donation-request",
  validateRequest(requestValidation.RequestSchema),
  auth("user", "admin"),
  requestController.donationRequest
);

router.get(
  "/myDonationsRequest",
  auth("user", "admin"),
  requestController.myDonationsAsDonor
);

router.get(
  "/donationRequestForMe",
  auth("user", "admin"),
  requestController.donationRequestForMe
);

router.put(
  "/donation-request/:requestId",
  validateRequest(requestValidation.RequestStatusSchema),
  auth("user", "admin"),
  requestController.updatedDonationStatus
);

export const RequestRoutes = router;
