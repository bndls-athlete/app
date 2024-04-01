import dbConnect from "@/lib/dbConnect";
import JobPostingModel from "@/models/JobPosting";
import BrandModel from "@/models/Brand";
import { auth } from "@clerk/nextjs";
import { jobPostingSchema, JobPosting } from "@/schemas/jobPostingSchema";
import { BrandTierManager } from "@/helpers/stripeBrandManager";
import mongoose from "mongoose";
import AthleteModel from "@/models/Athlete";

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
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");

    const skip = (page - 1) * limit;

    const authUser = auth();
    let athleteId: mongoose.Types.ObjectId | null = null;

    if (authUser) {
      const athlete = await AthleteModel.findOne({ userId: authUser.userId! });
      if (athlete) {
        athleteId = athlete._id;
      }
    }

    const [{ metadata, data }] = await JobPostingModel.aggregate([
      {
        $facet: {
          metadata: [
            {
              $count: "totalCount",
            },
          ],
          data: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $lookup: {
                from: "applications",
                let: { jobPostingId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$jobPostingId", "$$jobPostingId"] },
                          { $eq: ["$athleteId", athleteId] },
                        ],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                    },
                  },
                ],
                as: "application",
              },
            },
            {
              $addFields: {
                isApplied: {
                  $cond: [{ $gt: [{ $size: "$application" }, 0] }, true, false],
                },
              },
            },
            {
              $project: {
                _id: 1,
                brandId: 1,
                title: 1,
                city: 1,
                state: 1,
                feeCompensation: 1,
                opportunityDescription: 1,
                deliverables: 1,
                skillsRequired: 1,
                additionalPreferredSkills: 1,
                numberOfAthletes: 1,
                jobType: 1,
                athleteTierTarget: 1,
                createdAt: 1,
                updatedAt: 1,
                isApplied: 1,
              },
            },
            {
              $lookup: {
                from: "brands",
                localField: "brandId",
                foreignField: "_id",
                as: "brand",
                pipeline: [
                  {
                    $project: {
                      _id: 0,
                      companyName: 1,
                      bio: 1,
                    },
                  },
                ],
              },
            },
            {
              $unwind: {
                path: "$brand",
                preserveNullAndEmptyArrays: true,
              },
            },
          ],
        },
      },
    ]);

    const totalCount = metadata[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Job postings retrieved successfully",
        jobPostings: data,
        currentPage: page,
        totalPages,
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
