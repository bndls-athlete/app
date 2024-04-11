import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs";
import BookmarkModel from "@/models/Bookmark";
import mongoose from "mongoose";
import BrandModel from "@/models/Brand";

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
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const page = parseInt(url.searchParams.get("page") || "1");
    const skip = (page - 1) * limit;

    const brand = await BrandModel.findOne({ userId: authUser.userId! }).lean();
    if (!brand) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const pipeline = [
      {
        $match: {
          brandId: brand._id,
        },
      },
      {
        $lookup: {
          from: "athletes",
          localField: "athleteId",
          foreignField: "_id",
          as: "athlete",
        },
      },
      {
        $unwind: "$athlete",
      },
      {
        $facet: {
          metadata: [
            { $count: "total" },
            {
              $addFields: {
                page: page,
                limit: limit,
              },
            },
          ],
          data: [{ $skip: skip }, { $limit: limit }],
        },
      },
    ];

    const results = await BookmarkModel.aggregate(pipeline);

    const bookmarks = results[0].data;
    const metadata = results[0].metadata[0];
    const totalPages = Math.ceil(metadata.total / limit);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bookmarks retrieved successfully",
        bookmarks,
        currentPage: page,
        totalPages,
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
