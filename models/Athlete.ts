import mongoose, { Schema, Document } from "mongoose";
import { Athlete as AthleteBase, athleteSchema } from "@/schemas/athleteSchema";

export type Athlete = AthleteBase & mongoose.Document;

const AthleteSchema: Schema<Athlete> = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: String,
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: String,
  gender: String,
  receiveUpdates: Boolean,
  address: {
    countryRegion: String,
    streetName: String,
    houseApartmentNumber: String,
    city: String,
    state: String,
    zipCode: String,
  },
  dateOfBirth: Date,
  registrationType: {
    type: String,
    enum: ["individual", "team"],
    required: true,
  },
  // Individual specific fields
  collegeUniversity: String,
  graduationDate: Date,
  sport: String,
  professionalSkills: [String],
  currentAcademicGPA: Number,
  professionalReferences: [String],
  athleticCareerHighlights: String,
  bio: String,
  reel: String,
  // Team specific fields
  teamGender: String,
  teamGPA: Number,
  teamBio: String,
  teamHighlights: String,
  // Common fields
  socialProfiles: {
    instagram: String,
    tiktok: String,
    facebook: String,
    twitter: String,
  },
  followers: Number,
  engagementRate: Number,
  athleteRating: Number,
  athleteInformation: String,
  // Payments
  // Stripe customer ID for managing subscriptions and payments
  stripeCustomerId: String,
  // Stripe subscription ID to track the subscription status
  stripeSubscriptionId: String,
  // Subscription status to manage the subscription lifecycle
  subscriptionStatus: {
    type: String,
    enum: [
      "active", // Subscription is active and payments are up-to-date. Allow access to premium features.
      "inactive", // Subscription is inactive, possibly due to manual deactivation. Restrict access to premium features.
      "canceled", // Subscription has been canceled and will not renew. Restrict access to premium features.
      "past_due", // Payment for the subscription is past due. Consider sending reminders and restrict access if necessary.
      "unpaid", // Subscription is unpaid and may be suspended. Restrict access to premium features.
    ],
  },
  // Athlete tier to categorize athletes and determine subscription price
  athleteTier: {
    type: Number,
    enum: [1, 2, 3],
  },
});

const AthleteModel =
  (mongoose.models.Athlete as mongoose.Model<Athlete>) ||
  mongoose.model<Athlete>("Athlete", AthleteSchema);

export default AthleteModel;
