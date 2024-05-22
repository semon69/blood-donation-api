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
exports.requestService = void 0;
const prisma_1 = require("../../helpers/prisma");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const donationRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    //   console.log({ user }, { payload });
    const user = req === null || req === void 0 ? void 0 : req.user;
    const payload = req.body;
    yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id: payload.donorId,
        },
    });
    const requestData = Object.assign({ requesterId: user.id }, payload);
    const result = yield prisma_1.prisma.request.create({
        data: requestData,
        select: {
            id: true,
            donorId: true,
            requesterId: false,
            phoneNumber: true,
            dateOfDonation: true,
            hospitalName: true,
            hospitalAddress: true,
            reason: true,
            requestStatus: true,
            createdAt: true,
            updatedAt: true,
            donor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bloodType: true,
                    location: true,
                    availability: true,
                    createdAt: true,
                    updatedAt: true,
                    userProfile: true,
                },
            },
        },
    });
    return result;
});
const myDonations = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req === null || req === void 0 ? void 0 : req.user;
    const donor = yield prisma_1.prisma.request.findMany({
        where: {
            donorId: user.id
        }
    });
    if (!donor.length) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "you don't have any request");
    }
    const result = yield prisma_1.prisma.request.findMany({
        where: {
            donorId: user.id,
        },
        select: {
            id: true,
            donorId: true,
            requesterId: true,
            phoneNumber: true,
            dateOfDonation: true,
            hospitalName: true,
            hospitalAddress: true,
            reason: true,
            requestStatus: true,
            createdAt: true,
            updatedAt: true,
            requester: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    location: true,
                    bloodType: true,
                    availability: true,
                },
            },
        },
    });
    return result;
});
const updatedDonationStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    const { status } = req.body;
    const userData = yield prisma_1.prisma.request.findUnique({
        where: {
            id: requestId,
        },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Request data not found");
    }
    // console.log(donorData);
    const updateStatus = yield prisma_1.prisma.request.update({
        where: {
            id: requestId
        },
        data: {
            requestStatus: status
        }
    });
    return updateStatus;
});
exports.requestService = {
    donationRequest,
    myDonations,
    updatedDonationStatus,
};
