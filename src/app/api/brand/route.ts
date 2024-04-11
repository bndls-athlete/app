import dbConnect from "@/lib/dbConnect";
import BrandModel from "@/models/Brand";
import { auth } from "@clerk/nextjs";
import { brandSchema, Brand } from "@/schemas/brandSchema";

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
    const updates: Partial<Brand> = await request.json();
    const deepPartialBrandSchema = brandSchema.deepPartial();
    const parsedResult = deepPartialBrandSchema.safeParse(updates);

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

    const updatedBrand = await BrandModel.findOneAndUpdate(
      { userId: authUser.userId! },
      updates,
      { new: true }
    );

    if (!updatedBrand) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Brand not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Brand updated successfully",
        brand: updatedBrand,
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

    return new Response(
      JSON.stringify({
        success: true,
        message: "Brand retrieved successfully",
        brand: brand,
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
