import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import BrandModel from "@/models/Brand";

export async function GET(request: Request) {
  await dbConnect();

  const authUser = auth();

  if (!authUser || !authUser.userId) {
    return new Response(
      JSON.stringify({
        error: {
          code: "no-access",
          message: "You are not signed in.",
        },
      }),
      { status: 401 }
    );
  }

  try {
    const brand = await BrandModel.findOne({ userId: authUser.userId });

    if (!brand || !brand.stripeCustomerId) {
      return new Response(
        JSON.stringify({
          error: {
            code: "brand-not-found",
            message: "Brand not found or Stripe customer ID is missing.",
          },
        }),
        { status: 404 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    // Create a session for the Stripe Customer Portal
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: brand.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/brand/plan`,
    });

    if (!portalSession.url) {
      return new Response(
        JSON.stringify({
          error: {
            code: "stripe-error",
            message: "Could not create billing portal session",
          },
        }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ url: portalSession.url }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: { code: "internal-error", message: "Error processing request" },
      }),
      { status: 500 }
    );
  }
}
