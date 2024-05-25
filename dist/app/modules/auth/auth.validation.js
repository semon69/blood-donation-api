"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePasswordValidation = void 0;
const zod_1 = require("zod");
exports.changePasswordValidation = zod_1.z
    .object({
    oldPassword: zod_1.z.string({ required_error: "Old password is required" }),
    newPassword: zod_1.z
        .string({ required_error: "New password is required" }),
    confirmPassword: zod_1.z
        .string({ required_error: "Confirm password is required" }),
})
    .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New password and confirm password must match",
    path: ["confirmPassword"], // path indicates where the error message should appear
});
