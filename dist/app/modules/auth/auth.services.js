"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const config_1 = __importDefault(require("../../config"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const prisma_1 = require("../../helpers/prisma");
const bcrypt_1 = __importDefault(require("bcrypt"));
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            email: payload === null || payload === void 0 ? void 0 : payload.email,
        },
    });
    const isPasswordCorrect = yield bcrypt_1.default.compare(payload === null || payload === void 0 ? void 0 : payload.password, userData === null || userData === void 0 ? void 0 : userData.password);
    if (!isPasswordCorrect) {
        throw new Error("Incorrect Password");
    }
    const token = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData === null || userData === void 0 ? void 0 : userData.email,
        id: userData === null || userData === void 0 ? void 0 : userData.id
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        token,
    };
});
exports.authService = {
    loginUser
};
