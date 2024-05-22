"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = express_1.default.Router();
router.post("/register", (0, validateRequest_1.default)(user_validation_1.userValidation.UserSchema), user_controller_1.userController.createUser);
router.get("/donor-list", user_controller_1.userController.getDonorLists);
router.get("/my-profile", (0, auth_1.auth)(), user_controller_1.userController.getMyProfile);
router.put("/my-profile", (0, validateRequest_1.default)(user_validation_1.userValidation.UserProfileUpdateSchema), (0, auth_1.auth)(), user_controller_1.userController.updateMyProfile);
exports.UserRoutes = router;
