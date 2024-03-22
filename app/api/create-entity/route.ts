import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import BrandModel from "@/models/Brand";
import { auth } from "@clerk/nextjs";
import { athleteSchema, Athlete } from "@/schemas/athleteSchema";
import { brandSchema, Brand } from "@/schemas/brandSchema";
import { clerkClient } from "@clerk/nextjs";
import { UserTypeType } from "@/schemas/signUpSchema";

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
    const {
      email,
      userType,
      updates,
    }: { email: string; userType: UserTypeType; updates: boolean } =
      await request.json();

    const user = await clerkClient.users.getUser(authUser.userId!);

    await clerkClient.users.updateUserMetadata(authUser.userId!, {
      publicMetadata: {
        userType: userType,
      },
    });

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    if (userType === "athlete" || userType === "team") {
      const athleteData: Athlete = {
        userId: authUser.userId!,
        fullName: fullName,
        email: email,
        receiveUpdates: updates,
        registrationType: userType === "athlete" ? "individual" : "team",
      };

      const parsedResult = athleteSchema.safeParse(athleteData);

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

      const newAthlete = new AthleteModel(athleteData);
      await newAthlete.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Athlete created successfully",
          athlete: newAthlete,
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } else if (userType === "company") {
      const brandData: Brand = {
        userId: authUser.userId!,
        companyName: fullName,
        email: email,
      };

      const parsedResult = brandSchema.safeParse(brandData);

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

      const newBrand = new BrandModel(brandData);
      await newBrand.save();

      return new Response(
        JSON.stringify({
          success: true,
          message: "Brand created successfully",
          brand: newBrand,
        }),
        { status: 201, headers: { "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid user type",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error processing request" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
