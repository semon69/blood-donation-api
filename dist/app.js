"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const uset_routes_1 = require("./app/modules/user/uset.routes");
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const auth_routes_1 = require("./app/modules/auth/auth.routes");
const request_routes_1 = require("./app/modules/request/request.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// parser 
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// app.use(co)
app.set('query parser', 'simple');
app.get("/", (req, res) => {
    res.send({
        message: "Blood Donation server is running",
    });
});
app.use('/api', uset_routes_1.UserRoutes);
app.use('/api', auth_routes_1.AuthRoutes);
app.use('/api', request_routes_1.RequestRoutes);
app.use(globalErrorHandler_1.default);
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: 'API not found',
        errorDetails: {
            path: req.originalUrl,
            message: 'Your request path is not found'
        }
    });
});
exports.default = app;
