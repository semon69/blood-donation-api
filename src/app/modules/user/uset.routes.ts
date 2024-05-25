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

router.get("/allUser", auth("admin"), userController.getAllUserForAdmin);

router.get("/my-profile", auth("user", "admin"), userController.getMyProfile);

router.get("/donor/:id", userController.getSingleDonor);

router.patch(
  "/my-profile",
  validateRequest(userValidation.UserProfileUpdateSchema),
  auth("user", "admin"),
  userController.updateMyProfile
);

router.patch(
  "/updateActiveStatus/:id",
  validateRequest(userValidation.updateActiveStatus),
  auth("admin"),
  userController.updateActiveStatus
);

router.patch(
  "/updateUserRole/:id",
  validateRequest(userValidation.updateUserRole),
  auth("admin"),
  userController.updateUserRole
);

export const UserRoutes = router;
