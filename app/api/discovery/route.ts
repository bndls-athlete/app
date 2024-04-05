import dbConnect from "@/lib/dbConnect";
import BrandModel from "@/models/Brand";
import { auth } from "@clerk/nextjs";
import AthleteModel from "@/models/Athlete";
import { Athlete } from "@/schemas/athleteSchema";

export async function GET(request: Request) {
  await dbConnect();
  const authUser = auth();
  if (!authUser) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const brand = await BrandModel.findOne({ userId: authUser.userId! });
    if (!brand) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const url = new URL(request.url);
    const menu = url.searchParams.get("menu") || "instagram";
    const state = url.searchParams.get("state");
    const city = url.searchParams.get("city");
    const followersMin = parseInt(url.searchParams.get("followersMin") || "0");
    const followersMax = parseInt(url.searchParams.get("followersMax") || "0");
    const gender = url.searchParams.get("gender");
    const rating = parseFloat(url.searchParams.get("rating") || "0");
    const sport = url.searchParams.get("sport");
    const username = url.searchParams.get("username");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");

    const skip = (page - 1) * limit;

    let athletes: Athlete[] = [];
    let usernameResult: Athlete | null = null;

    if (username) {
      usernameResult = await AthleteModel.findOne({
        [`socialProfiles.${menu}`]: username,
      });
    } else {
      const pipeline = [];

      if (state || city) {
        pipeline.push({
          $search: {
            index: "default",
            text: {
              query: `${state || ""} ${city || ""}`,
              path: {
                wildcard: "*",
              },
            },
          },
        });
      }

      const query: any = {};

      if (followersMin > 0) {
        query[`followers.${menu}`] = { $gte: followersMin };
      }

      if (followersMax > 0) {
        query[`followers.${menu}`] = {
          ...(query[`followers.${menu}`] || {}),
          $lte: followersMax,
        };
      }

      if (gender !== undefined) {
        if (gender === "") {
          delete query.gender;
        } else {
          query.gender = gender;
        }
      }

      if (rating > 0) {
        query.athleteRating = { $gte: rating };
      }

      if (sport !== undefined) {
        if (sport === "") {
          delete query.sport;
        } else {
          query.sport = sport;
        }
      }

      pipeline.push({ $match: query });

      const countResult = await AthleteModel.aggregate([
        ...pipeline,
        { $count: "totalCount" },
      ]);

      const totalCount = countResult[0]?.totalCount || 0;
      const totalPages = Math.ceil(totalCount / limit);

      pipeline.push({ $skip: skip }, { $limit: limit });

      athletes = await AthleteModel.aggregate(pipeline);

      return new Response(
        JSON.stringify({
          success: true,
          message: "Athletes retrieved successfully",
          athletes,
          usernameResult,
          currentPage: page,
          totalPages,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Athletes retrieved successfully",
        athletes,
        usernameResult,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error processing request" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
