import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import { AthleteCard } from "@/schemas/athleteCardSchema";
import { auth } from "@clerk/nextjs";

export async function GET() {
  await dbConnect();

  const authUser = auth();

  if (!authUser) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const athlete = await AthleteModel.findOne({ userId: authUser.userId! });

    if (!athlete) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Athlete not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const athleteCard: AthleteCard = {
      fullName: athlete.fullName || "Unavailable",
      email: athlete.email || "Unavailable",
      tier: `Tier ${athlete.athleteTier || 3}`,
      location:
        athlete.address?.city || athlete.address?.countryRegion
          ? `${athlete.address?.city || "Unavailable"}, ${
              athlete.address?.countryRegion || "Unavailable"
            }`
          : "Unavailable",

      followers: athlete.followers || null,
      engagementRate: athlete.engagementRate || null,
      athleteRating: athlete.athleteRating || null,
      // followers: 240000,
      // engagementRate: 240000,
      // athleteRating: 4.2,
      careerStats: 69500,
      academicPerformance: 69500,
      preseasonAwards: 69500,
      personalPreferences: 69500,
      bio: athlete.bio || "Unavailable",
      reel: athlete.reel || "",
      socialProfiles: {
        instagram: athlete.socialProfiles?.instagram || "",
        tiktok: athlete.socialProfiles?.tiktok || "",
        facebook: athlete.socialProfiles?.facebook || "",
        twitter: athlete.socialProfiles?.twitter || "",
      },
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: "Athlete card retrieved successfully",
        athleteCard: athleteCard,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error processing request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
