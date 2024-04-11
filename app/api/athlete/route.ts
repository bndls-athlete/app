import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import { auth } from "@clerk/nextjs";
import {
  athleteSchema,
  Athlete,
  sportsEnum,
  AthleteTier,
  athleteTierEnum,
} from "@/schemas/athleteSchema";
import { AthleteRegistrationType } from "@/types/athleteRegisterationTypes";

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

    // Reject requests that try to update the registrationType
    if ("registrationType" in updates) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Updating registrationType is not allowed",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

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

    // Calculate the athlete rating and tier after updating the athlete document
    const { rating, tier } = calculateAthleteRating(updatedAthlete);
    updatedAthlete.athleteRating = rating;
    updatedAthlete.athleteTier = tier;
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

function calculateAthleteRating(athlete: Athlete): {
  rating: number;
  tier: AthleteTier;
} {
  let rating = 0;

  // Calculate rating based on followers
  const totalFollowers =
    (athlete.followers?.instagram || 0) +
    (athlete.followers?.tiktok || 0) +
    (athlete.followers?.youtube || 0) +
    (athlete.followers?.twitter || 0);

  if (totalFollowers >= 750000) {
    rating += 1;
  } else if (totalFollowers >= 400000) {
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
  if (athlete.registrationType === AthleteRegistrationType.Individual) {
    let maxSportRating = 0;

    if (athlete.sports.includes(sportsEnum.baseball)) {
      let baseballRating = 0;
      if (athlete.baseballStats?.era !== undefined) {
        const eraRating = 10 - athlete.baseballStats.era;
        baseballRating += Math.max(eraRating, 0) * 0.1;
      }
      if (athlete.baseballStats?.wins !== undefined) {
        baseballRating += athlete.baseballStats.wins * 0.05;
      }
      if (athlete.baseballStats?.battingAverage !== undefined) {
        baseballRating += athlete.baseballStats.battingAverage * 5;
      }
      if (athlete.baseballStats?.hits !== undefined) {
        baseballRating += athlete.baseballStats.hits * 0.01;
      }
      maxSportRating = Math.max(maxSportRating, baseballRating);
    }

    if (athlete.sports.includes(sportsEnum.basketball)) {
      let basketballRating = 0;
      if (athlete.basketballStats?.starRating !== undefined) {
        basketballRating += athlete.basketballStats.starRating * 0.2;
      }
      maxSportRating = Math.max(maxSportRating, basketballRating);
    }

    if (athlete.sports.includes(sportsEnum.football)) {
      let footballRating = 0;
      if (athlete.footballStats?.starRating !== undefined) {
        footballRating += athlete.footballStats.starRating * 0.2;
      }
      maxSportRating = Math.max(maxSportRating, footballRating);
    }

    if (athlete.sports.includes(sportsEnum.soccer)) {
      let soccerRating = 0;
      if (athlete.soccerStats?.cleanSheets !== undefined) {
        soccerRating += athlete.soccerStats.cleanSheets * 0.1;
      }
      if (athlete.soccerStats?.goalsScored !== undefined) {
        soccerRating += athlete.soccerStats.goalsScored * 0.1;
      }
      if (athlete.soccerStats?.assists !== undefined) {
        soccerRating += athlete.soccerStats.assists * 0.1;
      }
      maxSportRating = Math.max(maxSportRating, soccerRating);
    }

    rating += maxSportRating;
  } else if (athlete.registrationType === AthleteRegistrationType.Team) {
    if (
      athlete.winsLossRecord?.wins !== undefined &&
      athlete.winsLossRecord?.losses !== undefined
    ) {
      const totalGames =
        athlete.winsLossRecord.wins + athlete.winsLossRecord.losses;
      if (totalGames > 0) {
        const winPercentage = athlete.winsLossRecord.wins / totalGames;
        rating += winPercentage * 2;
      }
    }
  }

  // Ensure the rating doesn't go below 0
  rating = Math.max(rating, 0);

  let athleteTier: AthleteTier = athleteTierEnum["3"]; // Default to Tier 3
  if (rating >= 4.5) {
    athleteTier = athleteTierEnum["1"]; // Tier 1
  } else if (rating >= 3.5) {
    athleteTier = athleteTierEnum["2"]; // Tier 2
  }

  const calculatedRating = Math.min(Math.round(rating * 2) / 2, 5);
  return { rating: calculatedRating, tier: athleteTier };
}
