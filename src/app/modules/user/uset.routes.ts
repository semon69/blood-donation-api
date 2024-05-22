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

router.get("/my-profile", auth(), userController.getMyProfile);

router.put(
  "/my-profile",
  validateRequest(userValidation.UserProfileUpdateSchema),
  auth(),
  userController.updateMyProfile
);

export const UserRoutes = router;
