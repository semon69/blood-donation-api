"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler = (err, req, res, next) => {
    res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send({
        success: false,
        message: err === null || err === void 0 ? void 0 : err.message,
        errorDetails: err,
    });
    next();
};
exports.default = globalErrorHandler;
