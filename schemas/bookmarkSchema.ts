import { z } from "zod";
import mongoose from "mongoose";

export const bookmarkSchema = z.object({
  brandId: z.custom<mongoose.Types.ObjectId>(),
  athleteId: z.custom<mongoose.Types.ObjectId>(),
  isBookmarked: z.boolean(),
});

export type Bookmark = z.infer<typeof bookmarkSchema>;
