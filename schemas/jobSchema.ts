import { z } from "zod";

export const JobTypeSchema = z.enum([
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary",
]);
export type JobType = z.infer<typeof JobTypeSchema>;

export const DeliverableSchema = z.object({
  title: z.string(),
  duration: z.string(),
  description: z.string(),
});
export type Deliverable = z.infer<typeof DeliverableSchema>;

export const JobDataSchema = z.object({
  title: z.string(),
  postedDaysAgo: z.number(),
  location: z.string(),
  feeCompensation: z.number(),
  aboutCompany: z.string(),
  opportunityDescription: z.string(),
  deliverables: z.array(DeliverableSchema),
  nonExclusiveDealDetails: z.string(),
  totalCompensation: z.string(),
  skillsRequired: z.array(z.string()),
  additionalPreferredSkills: z.array(z.string()),
  numberOfAthletes: z.string(),
  jobType: JobTypeSchema,
});
export type JobData = z.infer<typeof JobDataSchema>;
