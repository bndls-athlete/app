import mongoose, { Schema, Document } from "mongoose";
import { Application as ApplicationBase } from "@/schemas/applicationSchema";

export type Application = ApplicationBase & mongoose.Document;

const ApplicationSchema: Schema<Application> = new mongoose.Schema(
  {
    jobPostingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    athleteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Athlete",
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "appliedAt",
      updatedAt: false,
    },
  }
);

ApplicationSchema.index({ appliedAt: -1 });

const ApplicationModel =
  (mongoose.models.Application as mongoose.Model<Application>) ||
  mongoose.model<Application>("Application", ApplicationSchema);

export default ApplicationModel;
