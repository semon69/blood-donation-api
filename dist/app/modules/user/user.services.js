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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../../helpers/prisma");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (payload.password != payload.confirmPassword) {
        throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Password doesn't match");
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    const role = "user";
    const userData = {
        name: payload.name,
        userName: payload.userName,
        email: payload.email,
        password: hashedPassword,
        role,
        image: payload.image,
        contactNo: payload.contactNo,
        availability: payload === null || payload === void 0 ? void 0 : payload.availability,
        bloodType: payload.bloodType,
        location: payload.location,
        lastDonationDate: payload.lastDonationDate,
    };
    // const userProfileData = {
    //   age: payload.age,
    //   bio: payload.bio,
    //   lastDonationDate: payload.lastDonationDate,
    // };
    const createUserData = yield prisma_1.prisma.user.create({
        data: userData,
        select: {
            id: true,
            name: true,
            userName: true,
            email: true,
            role: true,
            image: true,
            contactNo: true,
            bloodType: true,
            location: true,
            availability: true,
            lastDonationDate: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    // const result = await prisma.$transaction(async (transactionClient) => {
    //   // const createUserProfile = await transactionClient.userProfile.create({
    //   //   data: {
    //   //     userId: createUserData.id,
    //   //     ...userProfileData,
    //   //   },
    //   // });
    //   // Update the selected user data to include the created userProfile
    //   // createUserData.userProfile = createUserProfile;
    //   return createUserData;
    // });
    return createUserData;
});
const getDonorLists = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    //   const { searchTerm, ...filterData } = params;
    const { page = 1, limit = 20, sortBy, sortOrder, searchTerm } = queryParams, filterData = __rest(queryParams, ["page", "limit", "sortBy", "sortOrder", "searchTerm"]);
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    // const andConditions: Prisma.UserWhereInput[] = [];
    const andConditions = [{ isActive: true }];
    if (searchTerm) {
        andConditions.push({
            OR: ["email", "name", "location", "bloodType"].map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    const filterDataArray = Object.keys(filterData);
    if (filterDataArray.length > 0) {
        andConditions.push({
            AND: filterDataArray.map((key) => {
                const value = filterData[key];
                if (typeof value === "string") {
                    if (value.toLowerCase() === "true" ||
                        value.toLowerCase() === "false") {
                        return {
                            [key]: {
                                equals: value.toLowerCase() === "true",
                            },
                        };
                    }
                    else {
                        return {
                            [key]: {
                                equals: value,
                            },
                        };
                    }
                }
                else {
                    return {
                        [key]: {
                            equals: value,
                        },
                    };
                }
            }),
        });
    }
    const whereConditions = { AND: andConditions };
    //   console.dir(whereConditions, { depth: Infinity });
    const result = yield prisma_1.prisma.user.findMany({
        where: whereConditions,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
        orderBy: sortBy && sortOrder
            ? {
                [sortBy]: sortOrder,
            }
            : {
                createdAt: "desc",
            },
        select: {
            id: true,
            name: true,
            email: true,
            userName: true,
            image: true,
            contactNo: true,
            bloodType: true,
            location: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.prisma.user.count({
        where: whereConditions,
    });
    return {
        meta: {
            total,
            page: pageNumber,
            limit: limitNumber,
        },
        data: result,
    };
});
const getAllUserForAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isActive: true,
            userName: true,
            image: true,
            contactNo: true,
            bloodType: true,
            location: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    const total = yield prisma_1.prisma.user.count();
    return {
        meta: {
            total,
            page: 1,
            limit: 10,
        },
        data: result,
    };
});
const getMyProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id: req.user.id,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            email: true,
            userName: true,
            role: true,
            image: true,
            contactNo: true,
            bloodType: true,
            location: true,
            availability: true,
            lastDonationDate: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
const getSingleDonor = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id,
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            email: true,
            userName: true,
            role: true,
            image: true,
            contactNo: true,
            bloodType: true,
            location: true,
            availability: true,
            lastDonationDate: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return result;
});
const updateMyProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: {
            id: req.user.id,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not founr");
    }
    const update = yield prisma_1.prisma.user.update({
        where: {
            id: user.id,
        },
        data: req.body,
    });
    return update;
});
const updateActiveStatus = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { isActive } = req.body;
    const userData = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    // console.log(donorData);
    const updateStatus = yield prisma_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            isActive: isActive,
        },
    });
    return updateStatus;
});
const updateUserRole = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { role } = req.body;
    const userData = yield prisma_1.prisma.user.findUnique({
        where: {
            id,
        },
    });
    if (!userData) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found");
    }
    const updateRole = yield prisma_1.prisma.user.update({
        where: {
            id,
        },
        data: {
            role: role,
        },
    });
    return updateRole;
});
exports.userService = {
    createUser,
    getDonorLists,
    getAllUserForAdmin,
    getMyProfile,
    getSingleDonor,
    updateMyProfile,
    updateActiveStatus,
    updateUserRole
};
