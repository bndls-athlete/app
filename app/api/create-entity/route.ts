import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import BrandModel from "@/models/Brand";
import { auth } from "@clerk/nextjs";
import { athleteSchema, Athlete } from "@/schemas/athleteSchema";
import { brandSchema, Brand } from "@/schemas/brandSchema";
import { clerkClient } from "@clerk/nextjs";
import { UserTypeType } from "@/schemas/signUpSchema";
import { EntityType } from "@/types/entityTypes";

import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

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

    try {
      await clerkClient.users.updateUserMetadata(authUser.userId!, {
        publicMetadata: {
          userType: userType,
        },
      });

      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

      if (userType === EntityType.Athlete || userType === EntityType.Team) {
        const athleteData: Partial<Athlete> = {
          userId: authUser.userId!,
          fullName: fullName,
          email: email,
          receiveUpdates: updates,
          registrationType:
            userType === EntityType.Athlete ? "individual" : "team",
        };

        const deepPartialAthleteSchema = athleteSchema.deepPartial();
        const parsedResult = deepPartialAthleteSchema.safeParse(athleteData);

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

        // Create a Stripe customer
        const stripeCustomer = await stripe.customers.create({
          email: email,
          name: fullName,
        });

        // Add the Stripe customer ID to the athlete data
        athleteData.stripeCustomerId = stripeCustomer.id;

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
      } else if (userType === EntityType.Company) {
        const brandData: Partial<Brand> = {
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
    } catch (operationError) {
      console.error(
        "Operation failed, attempting to clean up:",
        operationError
      );
      // Delete Clerk user to clean up
      await clerkClient.users.deleteUser(authUser.userId!);
      // Return a response indicating failure and cleanup attempt
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to process request, user cleanup attempted",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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
