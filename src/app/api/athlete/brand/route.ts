import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import { auth } from "@clerk/nextjs";

export async function GET(request: Request) {
  await dbConnect();

  const authUser = auth();

  if (!authUser) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Extract the athlete's userId from the query parameters
  const url = new URL(request.url);
  const athleteUserId = url.searchParams.get("athleteUserId");

  if (!athleteUserId) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Athlete userId is required",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const athlete = await AthleteModel.findOne({ userId: athleteUserId });

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
