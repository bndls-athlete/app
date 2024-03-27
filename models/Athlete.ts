import mongoose, { Schema, Document } from "mongoose";
import { Athlete as AthleteBase } from "@/schemas/athleteSchema";

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
  athleteTier: {
    type: String,
    enum: ["1", "2", "3"],
  },
  // Stripe
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  stripeSubscriptionItemId: String,
  priceId: String,
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  cancelAtPeriodEnd: Boolean,
  subscriptionStatus: {
    type: String,
    enum: [
      "incomplete",
      "incomplete_expired",
      "trialing",
      "active",
      "past_due",
      "canceled",
      "unpaid",
      "paused",
    ],
  },
});

const AthleteModel =
  (mongoose.models.Athlete as mongoose.Model<Athlete>) ||
  mongoose.model<Athlete>("Athlete", AthleteSchema);

export default AthleteModel;
