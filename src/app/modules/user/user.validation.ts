import { z } from "zod";

const UserSchema = z.object({
  name: z.string({
    required_error: " Name is required",
  }),
  email: z.string({ required_error: "Email is required" }),
  password: z.string({ required_error: "Password is required" }),
  confirmPassword: z.string({ required_error: "Conformation Password is required" }),
  bloodType: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ]),
  location: z.string({ required_error: "Location is required" }),
  userName: z.string({ required_error: "User name is required" }),
  availability: z.boolean({ required_error: "availability is required" }),
  lastDonationDate: z.string({
    required_error: "Last donation date is required",
  }),
});

const UserProfileUpdateSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  userName: z.string().optional(),
  image: z.string().optional(),
  location: z.string().optional(),
  contactNo: z.string().optional(),
  lastDonationDate: z.string().optional(),
});

export const userValidation = {
  UserSchema,
  UserProfileUpdateSchema,
};
