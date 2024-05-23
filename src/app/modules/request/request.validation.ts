import { z } from "zod";

const RequestSchema = z.object({
  donorId: z.string({ required_error: "Donor ID is required" }),
  contactNo: z.string({ required_error: "Phone number is required" }),
  dateOfDonation: z.string({ required_error: "Date of donation is required" }),
  hospitalName: z.string({ required_error: "Hospital name is required" }),
  hospitalAddress: z.string({ required_error: "Hospital address is required" }),
  reason: z.string({ required_error: "Reason is required" }),
});

const RequestStatusSchema = z.object({
  status: z.enum(["APPROVED", "PENDING", "REJECTED"]),
});

export const requestValidation = {
  RequestSchema,
  RequestStatusSchema,
};
