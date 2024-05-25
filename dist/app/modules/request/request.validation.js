"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestValidation = void 0;
const zod_1 = require("zod");
const RequestSchema = zod_1.z.object({
    donorId: zod_1.z.string({ required_error: "Donor ID is required" }),
    contactNo: zod_1.z.string({ required_error: "Phone number is required" }),
    dateOfDonation: zod_1.z.string({ required_error: "Date of donation is required" }),
    hospitalName: zod_1.z.string({ required_error: "Hospital name is required" }),
    hospitalAddress: zod_1.z.string({ required_error: "Hospital address is required" }),
    reason: zod_1.z.string({ required_error: "Reason is required" }),
});
const RequestStatusSchema = zod_1.z.object({
    status: zod_1.z.enum(["APPROVED", "PENDING", "REJECTED"]),
});
exports.requestValidation = {
    RequestSchema,
    RequestStatusSchema,
};
