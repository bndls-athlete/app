import { z } from "zod";

const athleteSchema = z.object({
  userId: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  profilePicture: z.string().optional(),
  phoneNumber: z.string().optional(),
  gender: z.string().optional(),
  receiveUpdates: z.boolean().optional(),
  address: z
    .object({
      countryRegion: z.string().optional(),
      streetName: z.string().optional(),
      houseApartmentNumber: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional(),
    })
    .optional(),
  dateOfBirth: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : value)),
  registrationType: z.enum(["individual", "team"]).optional(),
  // Individual specific fields
  collegeUniversity: z.string().optional(),
  graduationDate: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : value)),
  sport: z.string().optional(),
  professionalSkills: z.array(z.string()).optional(),
  currentAcademicGPA: z.number().optional(),
  professionalReferences: z.array(z.string()).optional(),
  athleticCareerHighlights: z.string().optional(),
  bio: z.string().optional(),
  reel: z.string().optional(),
  // Team specific fields
  teamGender: z.string().optional(),
  teamGPA: z.number().optional(),
  teamBio: z.string().optional(),
  teamHighlights: z.string().optional(),
  // Common fields
  socialProfiles: z
    .object({
      instagram: z.string().optional(),
      tiktok: z.string().optional(),
      facebook: z.string().optional(),
      twitter: z.string().optional(),
    })
    .optional(),
  followers: z.number().optional(),
  engagementRate: z.number().optional(),
  athleteRating: z.number().optional(),
  athleteInformation: z.string().optional(),
});

export type Athlete = z.infer<typeof athleteSchema>;

export { athleteSchema };
