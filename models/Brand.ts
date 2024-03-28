import mongoose, { Schema, Document } from "mongoose";
import { Brand as BrandBase } from "@/schemas/brandSchema";
import { subscriptionStatusValues } from "@/schemas/subscriptionStatusSchema";

export type Brand = BrandBase & Document;

const BrandSchema: Schema<Brand> = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  industry: String,
  bio: String,
  website: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: String,
  address: {
    countryRegion: String,
    streetName: String,
    houseApartmentNumber: String,
    city: String,
    state: String,
    zipCode: String,
  },
  socialProfiles: {
    instagram: String,
    tiktok: String,
    facebook: String,
    twitter: String,
  },
  companyInformation: String,
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
    enum: Object.values(subscriptionStatusValues),
  },
});

const BrandModel =
  (mongoose.models.Brand as mongoose.Model<Brand>) ||
  mongoose.model<Brand>("Brand", BrandSchema);

export default BrandModel;
