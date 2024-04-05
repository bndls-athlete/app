import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import { auth } from "@clerk/nextjs";
import { athleteSchema, Athlete } from "@/schemas/athleteSchema";

export async function POST(request: Request) {
  await dbConnect();
  const authUser = auth();
  if (!authUser) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const updates: Partial<Athlete> = await request.json();
    const deepPartialAthleteSchema = athleteSchema.deepPartial();
    const parsedResult = deepPartialAthleteSchema.safeParse(updates);
    if (!parsedResult.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Validation failed",
          errors: parsedResult.error.issues,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const updatedAthlete = await AthleteModel.findOneAndUpdate(
      { userId: authUser.userId! },
      updates,
      { new: true }
    );

    if (!updatedAthlete) {
      return new Response(
        JSON.stringify({ success: false, message: "Athlete not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Calculate the athlete rating after updating the athlete document
    const athleteRating = calculateAthleteRating(updatedAthlete);
    updatedAthlete.athleteRating = athleteRating;
    await updatedAthlete.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Athlete updated successfully",
        athlete: updatedAthlete,
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "Athlete retrieved successfully",
        athlete: athlete,
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

function calculateAthleteRating(athlete: Partial<Athlete>): number {
  let rating = 0;

  // Calculate rating based on followers
  const totalFollowers =
    (athlete.followers?.instagram || 0) +
    (athlete.followers?.tiktok || 0) +
    (athlete.followers?.youtube || 0) +
    (athlete.followers?.twitter || 0);

  if (totalFollowers >= 1000000) {
    rating += 1;
  } else if (totalFollowers >= 500000) {
    rating += 0.75;
  } else if (totalFollowers >= 100000) {
    rating += 0.5;
  } else if (totalFollowers >= 10000) {
    rating += 0.25;
  }

  // Calculate rating based on GPA
  if (athlete.currentAcademicGPA) {
    if (athlete.currentAcademicGPA >= 3.8) {
      rating += 1;
    } else if (athlete.currentAcademicGPA >= 3.5) {
      rating += 0.75;
    } else if (athlete.currentAcademicGPA >= 3.0) {
      rating += 0.5;
    } else if (athlete.currentAcademicGPA >= 2.5) {
      rating += 0.25;
    }
  }

  // Calculate rating based on sport-specific stats
  if (athlete.sport === "baseball") {
    if (athlete.baseballStats?.winsAboveReplacement) {
      rating += athlete.baseballStats.winsAboveReplacement * 0.1;
    }
    if (athlete.baseballStats?.isolatedPower) {
      rating += athlete.baseballStats.isolatedPower * 0.1;
    }
    if (athlete.baseballStats?.weightedOnBaseAverage) {
      rating += athlete.baseballStats.weightedOnBaseAverage * 0.1;
    }
  } else if (athlete.sport === "basketball") {
    if (athlete.basketballStats?.points) {
      rating += athlete.basketballStats.points * 0.02;
    }
    if (athlete.basketballStats?.assists) {
      rating += athlete.basketballStats.assists * 0.02;
    }
    if (athlete.basketballStats?.rebounds) {
      rating += athlete.basketballStats.rebounds * 0.02;
    }
    if (athlete.basketballStats?.blocks) {
      rating += athlete.basketballStats.blocks * 0.02;
    }
    if (athlete.basketballStats?.steals) {
      rating += athlete.basketballStats.steals * 0.02;
    }
  } else if (athlete.sport === "soccer") {
    if (athlete.soccerStats?.cleanSheets) {
      rating += athlete.soccerStats.cleanSheets * 0.1;
    }
    if (athlete.soccerStats?.goalsScored) {
      rating += athlete.soccerStats.goalsScored * 0.1;
    }
    if (athlete.soccerStats?.assists) {
      rating += athlete.soccerStats.assists * 0.1;
    }
  }

  return Math.min(Math.round(rating * 2) / 2, 5);
}
