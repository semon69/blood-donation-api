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
  age: z.number({ required_error: "Age is required" }),
  bio: z.string({ required_error: "Bio is required" }),
  lastDonationDate: z.string({
    required_error: "Last donation date is required",
  }),
});

const UserProfileUpdateSchema = z.object({
  bio: z.string().optional(),
  age: z.number().optional(),
});

export const userValidation = {
  UserSchema,
  UserProfileUpdateSchema,
};
