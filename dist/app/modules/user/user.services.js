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
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedPassword = yield bcrypt_1.default.hash(payload.password, 12);
    const userData = {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        bloodType: payload.bloodType,
        location: payload.location,
    };
    const userProfileData = {
        age: payload.age,
        bio: payload.bio,
        lastDonationDate: payload.lastDonationDate,
    };
    const result = yield prisma_1.prisma.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
        const createUserData = yield transactionClient.user.create({
            data: userData,
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
        });
        const createUserProfile = yield transactionClient.userProfile.create({
            data: Object.assign({ userId: createUserData.id }, userProfileData),
        });
        // Update the selected user data to include the created userProfile
        createUserData.userProfile = createUserProfile;
        return createUserData;
    }));
    return result;
});
const getDonorLists = (queryParams) => __awaiter(void 0, void 0, void 0, function* () {
    //   const { searchTerm, ...filterData } = params;
    const { page = 1, limit = 10, sortBy, sortOrder, searchTerm } = queryParams, filterData = __rest(queryParams, ["page", "limit", "sortBy", "sortOrder", "searchTerm"]);
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const andConditions = [];
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
    //   if (filterDataArray.length > 0) {
    //     andConditions.push({
    //       AND: filterDataArray.map((key) => ({
    //         [key]: {
    //           equals: (filterData as any)[key],
    //         },
    //       })),
    //     });
    //   }
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
            bloodType: true,
            location: true,
            availability: true,
            createdAt: true,
            updatedAt: true,
            userProfile: true,
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
const getMyProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.user);
    const result = yield prisma_1.prisma.user.findUniqueOrThrow({
        where: {
            id: req.user.id,
        },
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
    });
    return result;
});
const updateMyProfile = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const update = yield prisma_1.prisma.userProfile.update({
        where: {
            userId: req.user.id
        },
        data: req.body
    });
    return update;
});
exports.userService = {
    createUser,
    getDonorLists,
    getMyProfile,
    updateMyProfile
};
