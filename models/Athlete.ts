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
  collegeUniversity: { type: String, required: false },
  graduationDate: { type: Date, required: false },
  sport: { type: String, required: false },
  professionalSkills: { type: [String], required: false },
  currentAcademicGPA: { type: Number, required: false },
  professionalReferences: { type: [String], required: false },
  athleticCareerHighlights: { type: String, required: false },
  bio: { type: String, required: false },
  reel: { type: String, required: false },
  // Team specific fields
  teamGender: { type: String, required: false },
  teamGPA: { type: Number, required: false },
  teamBio: { type: String, required: false },
  teamHighlights: { type: String, required: false },
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
});

const AthleteModel =
  (mongoose.models.Athlete as mongoose.Model<Athlete>) ||
  mongoose.model<Athlete>("Athlete", AthleteSchema);

export default AthleteModel;
