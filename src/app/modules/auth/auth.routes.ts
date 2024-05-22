import express from "express";
import { authController } from "./auth.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/login", authController.loginUser);


router.post("/change-password",auth("user", "admin"), authController.changePassword);

export const  AuthRoutes = router