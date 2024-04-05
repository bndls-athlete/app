import dbConnect from "@/lib/dbConnect";
import JobPostingModel from "@/models/JobPosting";
import BrandModel from "@/models/Brand";
import { auth } from "@clerk/nextjs";
import { jobPostingSchema, JobPosting } from "@/schemas/jobPostingSchema";
import { BrandTierManager } from "@/helpers/stripeBrandManager";
import ApplicationModel from "@/models/Application";

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
    const data: Partial<JobPosting> = await request.json();

    const brand = await BrandModel.findOne({ userId: authUser.userId! });

    if (!brand) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Brand not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const brandTierManager = BrandTierManager.getInstance();
    const hasAccess = brandTierManager.checkBrandAccessToAthlete(
      brand!,
      data.athleteTierTarget!
    );

    if (!hasAccess) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Brand does not have access to the selected athlete tiers",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    const dataWithBrandId = { ...data, brandId: brand._id };

    const parsedResult = jobPostingSchema.safeParse(dataWithBrandId);

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

    const jobPosting = new JobPostingModel(parsedResult.data);
    await jobPosting.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Job created successfully",
        jobPosting,
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

export async function GET(request: Request) {
  await dbConnect();

  const authUser = auth();

  if (!authUser) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const url = new URL(request.url);
    const jobPostingId = url.searchParams.get("jobPostingId");

    if (!jobPostingId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Job posting ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const jobPosting = await JobPostingModel.findById(jobPostingId);
    // .populate(
    //   "brandId"
    // );

    if (!jobPosting) {
      return new Response(
        JSON.stringify({ success: false, message: "Job posting not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true, jobPosting }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error processing request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  const authUser = auth();
  if (!authUser) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const brand = await BrandModel.findOne({ userId: authUser.userId! });
    if (!brand) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const url = new URL(request.url);
    const jobPostingId = url.searchParams.get("jobPostingId");

    if (!jobPostingId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Job posting ID is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const jobPosting = await JobPostingModel.findOne({
      _id: jobPostingId,
      brandId: brand._id,
    });

    if (!jobPosting) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Job posting not found or not associated with the brand",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Delete the associated applications
    await ApplicationModel.deleteMany({ jobPostingId });

    // Delete the job posting
    await JobPostingModel.findByIdAndDelete(jobPostingId);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Job posting and associated applications deleted successfully",
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
