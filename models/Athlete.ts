import mongoose, { Schema, Document } from "mongoose";
import { Athlete as AthleteBase } from "@/schemas/athleteSchema";
import { subscriptionStatusValues } from "@/schemas/subscriptionStatusSchema";
import { EntityType } from "@/types/entityTypes";

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
    enum: [EntityType.Athlete, EntityType.Team],
    required: true,
  },
  // Individual specific fields
  collegeUniversity: String,
  graduationDate: Date,
  sport: String,
  baseballStats: {
    winsAboveReplacement: Number,
    isolatedPower: Number,
    weightedOnBaseAverage: Number,
  },
  basketballStats: {
    points: Number,
    assists: Number,
    rebounds: Number,
    blocks: Number,
    steals: Number,
  },
  soccerStats: {
    cleanSheets: Number,
    goalsScored: Number,
    assists: Number,
  },
  professionalSkills: [String],
  currentAcademicGPA: Number,
  professionalReferences: [String],
  statsSourceURL: String,
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
    default: "3",
  },
  // Stripe
  stripeCustomerId: {
    type: String,
    required: true,
  },
  stripeSubscriptionId: String,
  stripeSubscriptionItemId: String,
  priceId: String,
  subscriptionStartDate: Date,
  subscriptionEndDate: Date,
  cancelAtPeriodEnd: Boolean,
  subscriptionStatus: {
    type: String,
    enum: Object.values(subscriptionStatusValues),
  },
});

const AthleteModel =
  (mongoose.models.Athlete as mongoose.Model<Athlete>) ||
  mongoose.model<Athlete>("Athlete", AthleteSchema);

export default AthleteModel;
