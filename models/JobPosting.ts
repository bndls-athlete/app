import mongoose, { Schema, Document } from "mongoose";
import {
  JobPosting as JobPostingBase,
  jobTypeSchema,
} from "@/schemas/jobPostingSchema";
import { AthleteTierNames } from "@/helpers/stripeAthleteManager";

export type JobPosting = JobPostingBase & Document;

const JobPostingSchema: Schema<JobPosting> = new Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    feeCompensation: Number,
    opportunityDescription: String,
    deliverables: [
      {
        title: String,
        duration: String,
        description: String,
      },
    ],
    skillsRequired: [String],
    additionalPreferredSkills: [String],
    numberOfAthletes: Number,
    jobType: {
      type: String,
      enum: jobTypeSchema.options,
    },
    athleteTierTarget: {
      type: [
        {
          type: String,
          required: true,
          enum: AthleteTierNames,
        },
      ],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

JobPostingSchema.index({ createdAt: -1 });

const JobPostingModel =
  mongoose.models.JobPosting ||
  mongoose.model<JobPosting>("JobPosting", JobPostingSchema);

export default JobPostingModel;
