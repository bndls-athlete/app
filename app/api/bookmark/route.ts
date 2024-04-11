import dbConnect from "@/lib/dbConnect";
import { auth } from "@clerk/nextjs";
import BookmarkModel from "@/models/Bookmark";
import BrandModel from "@/models/Brand";
import AthleteModel from "@/models/Athlete";
import { BrandTierManager } from "@/helpers/stripeBrandManager";
import mongoose from "mongoose";

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
    const athleteId = url.searchParams.get("athleteId");
    if (!athleteId || !mongoose.Types.ObjectId.isValid(athleteId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid Athlete ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const brand = await BrandModel.findOne({ userId: authUser.userId! });
    if (!brand) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const athlete = await AthleteModel.findById(athleteId);
    if (!athlete) {
      return new Response(
        JSON.stringify({ success: false, message: "Athlete not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // const brandTierManager = BrandTierManager.getInstance();
    // if (!brandTierManager.checkBrandAccessToAthlete(brand!, [athlete.athleteTier])) {
    //   return new Response(
    //     JSON.stringify({
    //       success: false,
    //       message: "Brand does not have access to bookmark the athlete",
    //     }),
    //     { status: 403, headers: { "Content-Type": "application/json" } }
    //   );
    // }

    const bookmark = await BookmarkModel.findOne({
      brandId: brand._id,
      athleteId: athlete._id,
    });

    const isBookmarked = !!bookmark;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bookmark status retrieved successfully",
        isBookmarked,
        athleteId: athlete._id.toString(),
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

export async function PUT(request: Request) {
  await dbConnect();
  const authUser = auth();
  if (!authUser) {
    return new Response(
      JSON.stringify({ success: false, message: "Not authenticated" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const { athleteId } = await request.json();

    if (!mongoose.Types.ObjectId.isValid(athleteId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid Athlete ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const brand = await BrandModel.findOne({ userId: authUser.userId! });
    if (!brand) {
      return new Response(
        JSON.stringify({ success: false, message: "Brand not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const athlete = await AthleteModel.findById(athleteId);
    if (!athlete) {
      return new Response(
        JSON.stringify({ success: false, message: "Athlete not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    let bookmark = await BookmarkModel.findOne({
      brandId: brand._id,
      athleteId: athlete._id,
    });

    let isBookmarked;
    if (bookmark) {
      await BookmarkModel.findByIdAndDelete(bookmark._id);
      isBookmarked = false;
    } else {
      bookmark = new BookmarkModel({
        brandId: brand._id,
        athleteId: athlete._id,
      });
      await bookmark.save();
      isBookmarked = true;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bookmark status updated successfully",
        isBookmarked,
        athleteId: athlete._id.toString(),
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
