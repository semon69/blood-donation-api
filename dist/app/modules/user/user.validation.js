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
    bloodType: zod_1.z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    location: zod_1.z.string({ required_error: "Location is required" }),
    age: zod_1.z.number({ required_error: "Age is required" }),
    bio: zod_1.z.string({ required_error: "Bio is required" }),
    lastDonationDate: zod_1.z.string({
        required_error: "Last donation date is required",
    }),
});
const UserProfileUpdateSchema = zod_1.z.object({
    bio: zod_1.z.string().optional(),
    age: zod_1.z.number().optional(),
});
exports.userValidation = {
    UserSchema,
    UserProfileUpdateSchema,
};
