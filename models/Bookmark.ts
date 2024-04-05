import mongoose, { Schema, Document } from "mongoose";
import { Bookmark as BookmarkBase } from "@/schemas/bookmarkSchema";

export type Bookmark = BookmarkBase & mongoose.Document;

const BookmarkSchema: Schema<Bookmark> = new mongoose.Schema(
  {
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
    isBookmarked: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

BookmarkSchema.index({ brandId: 1, athleteId: 1 }, { unique: true });

const BookmarkModel =
  (mongoose.models.Bookmark as mongoose.Model<Bookmark>) ||
  mongoose.model<Bookmark>("Bookmark", BookmarkSchema);

export default BookmarkModel;
