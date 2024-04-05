import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs";
import ApplicationModel from "@/models/Application";
import BrandModel from "@/models/Brand";
import mongoose from "mongoose";

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
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const jobPostingId = url.searchParams.get("jobPostingId");

    if (!jobPostingId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Job posting ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const skip = (page - 1) * limit;

    const [{ metadata, data }] = await ApplicationModel.aggregate([
      {
        $match: {
          brandId: brand._id,
          jobPostingId: new mongoose.Types.ObjectId(jobPostingId),
        },
      },
      {
        $facet: {
          metadata: [{ $count: "totalCount" }],
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "athletes",
                localField: "athleteId",
                foreignField: "_id",
                as: "athlete",
              },
            },
            { $unwind: "$athlete" },
          ],
        },
      },
    ]);

    const totalCount = metadata[0]?.totalCount || 0;
    const totalPages = Math.ceil(totalCount / limit);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Applications retrieved successfully",
        applications: data,
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
