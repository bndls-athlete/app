import mongoose, { Schema, Document } from "mongoose";
import {
  Athlete as AthleteBase,
  athleteTierEnum,
  athleteTierSchema,
  genderSchema,
  sportSchema,
} from "@/schemas/athleteSchema";
import { subscriptionStatusValues } from "@/schemas/subscriptionStatusSchema";
import { AthleteRegistrationType } from "@/types/athleteRegisterationTypes";

export type Athlete = AthleteBase & mongoose.Document;

const AthleteSchema: Schema<Athlete> = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  profilePicture: String,
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  gender: { type: String, enum: genderSchema.options },
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
    enum: [AthleteRegistrationType.Individual, AthleteRegistrationType.Team],
    required: true,
    default: AthleteRegistrationType.Individual,
  },
  // Individual specific fields
  schoolOrUniversity: String,
  graduationDate: Date,
  sports: [{ type: String, enum: sportSchema.enum }],
  baseballStats: {
    era: Number,
    wins: Number,
    battingAverage: Number,
    hits: Number,
  },
  basketballStats: {
    starRating: Number,
    position: String,
  },
  footballStats: {
    starRating: Number,
    position: String,
  },
  soccerStats: {
    cleanSheets: Number,
    goalsScored: Number,
    assists: Number,
  },
  winsLossRecord: {
    wins: Number,
    losses: Number,
  },
  tournamentsPlayedIn: String,
  professionalSkills: [String],
  currentAcademicGPA: Number,
  professionalReferences: [String],
  statsSourceURL: String,
  bio: String,
  reel: String,
  // Common fields
  socialProfiles: {
    instagram: String,
    tiktok: String,
    youtube: String,
    twitter: String,
  },
  followers: {
    instagram: Number,
    tiktok: Number,
    youtube: Number,
    twitter: Number,
  },
  // engagementRate: Number,
  athleteRating: Number,
  athleteTier: {
    type: String,
    enum: athleteTierSchema.options,
    default: athleteTierEnum["3"], // Default to Tier 3
  },
  // Stripe
  stripeCustomerId: { type: String, required: true },
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
