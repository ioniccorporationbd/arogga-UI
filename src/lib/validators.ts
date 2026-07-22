import { z } from "zod";

export const profileFormSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  mobile: z.string().regex(/^01\d{9}$/, "Use a valid Bangladeshi mobile number"),
  email: z.string().email("Use a valid email"),
  gender: z.string().min(1, "Select gender"),
  dateOfBirth: z.string().refine((value) => !Number.isNaN(Date.parse(value)) && new Date(value) < new Date(), "Select a valid past date"),
  bloodGroup: z.string().min(1, "Select blood group"),
  language: z.string().min(1, "Select language"),
});

export const genericActionSchema = z.object({
  title: z.string().min(2, "Title is required"),
  note: z.string().min(3, "Please add a short note"),
});
