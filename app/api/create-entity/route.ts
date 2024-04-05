import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import BrandModel from "@/models/Brand";
import { auth } from "@clerk/nextjs";
import { athleteSchema, Athlete } from "@/schemas/athleteSchema";
import { brandSchema, Brand } from "@/schemas/brandSchema";
import { clerkClient } from "@clerk/nextjs";
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
    }: { email: string; userType: EntityType; updates: boolean } =
      await request.json();
    const user = await clerkClient.users.getUser(authUser.userId!);

    await clerkClient.users.updateUserMetadata(authUser.userId!, {
      publicMetadata: { userType: userType },
    });

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

    switch (userType) {
      case EntityType.Athlete:
        return await handleAthlete(
          userType,
          authUser.userId!,
          fullName,
          email,
          updates
        );
      case EntityType.Company:
        return await handleBrand(authUser.userId!, fullName, email, updates);
      default:
        throw new Error("Invalid user type");
    }
  } catch (error) {
    console.error("Error processing request:", error);
    await cleanupUser(authUser.userId!);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error processing request, user cleanup attempted",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

async function cleanupUser(userId: string) {
  try {
    await clerkClient.users.deleteUser(userId);
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

async function handleAthlete(
  userType: EntityType,
  userId: string,
  fullName: string,
  email: string,
  updates: boolean
): Promise<Response> {
  const athleteData: Partial<Athlete> = {
    userId: userId,
    fullName: fullName,
    email: email,
    receiveUpdates: updates,
  };

  const deepPartialAthleteSchema = athleteSchema.deepPartial();
  const parsedResult = deepPartialAthleteSchema.safeParse(athleteData);

  if (!parsedResult.success) {
    throw new Error(
      JSON.stringify({
        success: false,
        message: "Validation failed",
        errors: parsedResult.error.issues,
      })
    );
  }

  // Create a Stripe customer
  const stripeCustomer = await stripe.customers.create({
    email: email,
    name: fullName,
    metadata: {
      payingUserId: userId,
      userType: userType,
    },
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
}

async function handleBrand(
  userId: string,
  companyName: string,
  email: string,
  updates: boolean
): Promise<Response> {
  const brandData: Partial<Brand> = {
    userId: userId,
    companyName: companyName,
    email: email,
    receiveUpdates: updates,
  };

  const deepPartialBrandSchema = brandSchema.deepPartial();
  const parsedResult = deepPartialBrandSchema.safeParse(brandData);

  if (!parsedResult.success) {
    throw new Error(
      JSON.stringify({
        success: false,
        message: "Validation failed",
        errors: parsedResult.error.issues,
      })
    );
  }

  // Create a Stripe customer for the brand
  const stripeCustomer = await stripe.customers.create({
    email: email,
    name: companyName,
    metadata: {
      payingUserId: userId,
      userType: EntityType.Company,
    },
  });

  // Add the Stripe customer ID to the brand data
  brandData.stripeCustomerId = stripeCustomer.id;

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
}
