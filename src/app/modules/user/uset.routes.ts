import express from "express";
import { userController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(userValidation.UserSchema),
  userController.createUser
);

router.get("/donor-list", userController.getDonorLists);

router.get("/my-profile", auth("user", "admin"), userController.getMyProfile);

router.get("/donor/:id", auth("user", "admin"), userController.getSingleDonor);

router.put(
  "/my-profile",
  validateRequest(userValidation.UserProfileUpdateSchema),
  auth("user", "admin"),
  userController.updateMyProfile
);

export const UserRoutes = router;
