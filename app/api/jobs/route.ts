import dbConnect from "@/lib/dbConnect";
import JobPostingModel from "@/models/JobPosting";
import { auth } from "@clerk/nextjs";
import mongoose from "mongoose";
import AthleteModel from "@/models/Athlete";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getFileUrl(fileKey: string): Promise<string> {
  try {
    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };
    const getObjectCommand = new GetObjectCommand(getObjectParams);
    const signedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 3600, // URL expires in 1 hour
    });

    return signedUrl;
  } catch (error) {
    console.error("Error getting file URL:", error);
    throw new Error("Error getting file URL");
  }
}

export async function GET(request: Request) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const title = url.searchParams.get("title") || "";
    const keywords = url.searchParams.get("keywords") || "";
    const city = url.searchParams.get("city") || "";
    const state = url.searchParams.get("state") || "";
    const jobType = url.searchParams.get("jobType") || "";
    const priceMin = parseInt(url.searchParams.get("priceMin") || "0");
    const priceMax = parseInt(url.searchParams.get("priceMax") || "0");
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

    const pipeline: any = [];

    if (title || keywords || city || state) {
      pipeline.push({
        $search: {
          index: "jobs",
          compound: {
            must: [
              {
                text: {
                  query: title,
                  path: "title",
                },
              },
              {
                text: {
                  query: keywords,
                  path: "opportunityDescription",
                },
              },
              {
                text: {
                  query: city,
                  path: "city",
                },
              },
              {
                text: {
                  query: state,
                  path: "state",
                },
              },
            ].filter((clause) => clause.text.query),
          },
        },
      });
    }

    const query: any = {};

    if (jobType) {
      query.jobType = jobType;
    }

    if (priceMin > 0) {
      query.feeCompensation = { $gte: priceMin };
    }

    if (priceMax > 0) {
      query.feeCompensation = {
        ...(query.feeCompensation || {}),
        $lte: priceMax,
      };
    }

    pipeline.push({ $match: query });

    const countResult = await JobPostingModel.aggregate([
      ...pipeline,
      { $count: "totalCount" },
    ]);

    const totalCount = countResult[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    pipeline.push(
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
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
                profilePicture: 1,
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
      }
    );

    const jobPostings = await JobPostingModel.aggregate(pipeline);

    for (const jobPosting of jobPostings) {
      if (jobPosting.brand && jobPosting.brand.profilePicture) {
        const profilePictureUrl = await getFileUrl(
          jobPosting.brand.profilePicture
        );
        jobPosting.brand.profilePicture = profilePictureUrl;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Job postings retrieved successfully",
        jobPostings,
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
