"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const request_controller_1 = require("./request.controller");
const auth_1 = require("../../middlewares/auth");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const request_validation_1 = require("./request.validation");
const router = express_1.default.Router();
router.post("/donation-request", (0, validateRequest_1.default)(request_validation_1.requestValidation.RequestSchema), (0, auth_1.auth)(), request_controller_1.requestController.donationRequest);
router.get("/donation-request", (0, auth_1.auth)(), request_controller_1.requestController.myDonations);
router.put("/donation-request/:requestId", (0, validateRequest_1.default)(request_validation_1.requestValidation.RequestStatusSchema), (0, auth_1.auth)(), request_controller_1.requestController.updatedDonationStatus);
exports.RequestRoutes = router;
