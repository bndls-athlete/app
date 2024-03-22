import mongoose, { Schema, Document } from "mongoose";
import { Brand as BrandBase, brandSchema } from "@/schemas/brandSchema";

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
});

const BrandModel =
  (mongoose.models.Brand as mongoose.Model<Brand>) ||
  mongoose.model<Brand>("Brand", BrandSchema);

export default BrandModel;
