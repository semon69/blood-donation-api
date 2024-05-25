"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const UserSchema = zod_1.z.object({
    name: zod_1.z.string({
        required_error: " Name is required",
    }),
    email: zod_1.z.string({ required_error: "Email is required" }),
    password: zod_1.z.string({ required_error: "Password is required" }),
    confirmPassword: zod_1.z.string({ required_error: "Conformation Password is required" }),
    bloodType: zod_1.z.enum([
        "A_POSITIVE",
        "A_NEGATIVE",
        "B_POSITIVE",
        "B_NEGATIVE",
        "AB_POSITIVE",
        "AB_NEGATIVE",
        "O_POSITIVE",
        "O_NEGATIVE",
    ]),
    location: zod_1.z.string({ required_error: "Location is required" }),
    userName: zod_1.z.string({ required_error: "User name is required" }),
    availability: zod_1.z.boolean({ required_error: "availability is required" }),
    lastDonationDate: zod_1.z.string({
        required_error: "Last donation date is required",
    }),
});
const UserProfileUpdateSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    userName: zod_1.z.string().optional(),
    image: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    contactNo: zod_1.z.string().optional(),
    lastDonationDate: zod_1.z.string().optional(),
});
const updateActiveStatus = zod_1.z.object({
    isActive: zod_1.z.boolean()
});
const updateUserRole = zod_1.z.object({
    role: zod_1.z.string()
});
exports.userValidation = {
    UserSchema,
    UserProfileUpdateSchema,
    updateActiveStatus,
    updateUserRole
};
