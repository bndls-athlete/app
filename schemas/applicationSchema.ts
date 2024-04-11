import { z } from "zod";
import mongoose from "mongoose";
// import { JobPosting } from "./jobPostingSchema";
import { Athlete } from "./athleteSchema";

export const applicationSchema = z.object({
  jobPostingId: z.custom<mongoose.Types.ObjectId>(),
  brandId: z.custom<mongoose.Types.ObjectId>(),
  athleteId: z.custom<mongoose.Types.ObjectId>(),
  appliedAt: z.date(),
});

export type Application = z.infer<typeof applicationSchema>;

export type ApplicationWithPopulatedFields = Application & {
  //   jobPosting: JobPosting;
  _id: mongoose.Types.ObjectId;
  athlete: Athlete;
};
