import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import { auth } from "@clerk/nextjs";
import JobPostingModel, { JobPosting } from "@/models/JobPosting";
import ApplicationModel from "@/models/Application";
import { AthleteTierManager } from "@/helpers/stripeAthleteManager";

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
    const data = await request.json();
    const { jobPostingId } = data;

    const athlete = await AthleteModel.findOne({ userId: authUser.userId! });
    if (!athlete) {
      return new Response(
        JSON.stringify({ success: false, message: "Athlete not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const jobPosting: JobPosting | null = await JobPostingModel.findById(
      jobPostingId
    );

    if (!jobPosting) {
      return new Response(
        JSON.stringify({ success: false, message: "Job posting not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the athlete has already applied to the job posting
    const existingApplication = await ApplicationModel.findOne({
      jobPostingId,
      athleteId: athlete._id,
    });

    if (existingApplication) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You have already applied to this job posting",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check if the athlete has access to the tier required for the job posting
    const athleteTierManager = AthleteTierManager.getInstance();
    const hasAccess = jobPosting.athleteTierTarget.some((tier) =>
      athleteTierManager.checkAthleteAccess(athlete, tier)
    );

    if (!hasAccess) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You don't have access to apply for this job posting",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const application = new ApplicationModel({
      jobPostingId,
      brandId: jobPosting.brandId,
      athleteId: athlete._id,
    });
    await application.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Job application submitted successfully",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error processing request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
