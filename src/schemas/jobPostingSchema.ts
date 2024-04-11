import { z } from "zod";
import { Brand } from "./brandSchema";
import { AthleteTierNames } from "@/helpers/stripeAthleteManager";
import mongoose from "mongoose";

export const deliverableSchema = z.object({
  title: z.string(),
  duration: z.string(),
  description: z.string(),
});

export const jobTypeSchema = z.enum([
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
  "",
]);

export const jobTypeEnum = jobTypeSchema.enum;

export const jobPostingSchema = z.object({
  brandId: z.object({
    _id: z.custom<mongoose.Types.ObjectId>(),
  }),
  title: z.string(),
  opportunityDescription: z.string(),
  city: z.string(),
  state: z.string(),
  feeCompensation: z.number(),
  deliverables: z.array(deliverableSchema).optional(),
  skillsRequired: z.array(z.string()),
  additionalPreferredSkills: z.array(z.string()).optional(),
  numberOfAthletes: z.number().optional(),
  jobType: jobTypeSchema,
  athleteTierTarget: z.array(z.enum(AthleteTierNames)),
});

export type Deliverable = z.infer<typeof deliverableSchema>;
export type JobType = z.infer<typeof jobTypeSchema>;
export type JobPosting = z.infer<typeof jobPostingSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
};

export type JobPostingWithCompanyInfo = Omit<JobPosting, "brandId"> & {
  brand: Pick<Brand, "bio" | "companyName" | "profilePicture">;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  isApplied: boolean;
};
