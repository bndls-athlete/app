import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";

export async function POST(request: Request) {
  await dbConnect();

  const authUser = auth();

  if (!authUser || !authUser.userId) {
    return Response.json(
      {
        error: {
          code: "no-access",
          message: "You are not signed in.",
        },
      },
      { status: 401 }
    );
  }

  try {
    const athlete = await AthleteModel.findOne({ userId: authUser.userId });

    if (!athlete || !athlete.stripeCustomerId) {
      return Response.json(
        {
          error: {
            code: "athlete-not-found",
            message: "Athlete not found or Stripe customer ID is missing.",
          },
        },
        { status: 404 }
      );
    }

    const body = await request.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: athlete.stripeCustomerId,
      line_items: [
        {
          price: body.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/checkout/cancelled`,
      subscription_data: {
        metadata: {
          payingUserId: authUser.userId,
          userType: authUser.sessionClaims.userType,
        },
      },
    });

    if (!checkoutSession.url) {
      return Response.json(
        {
          error: {
            code: "stripe-error",
            message: "Could not create checkout session",
          },
        },
        { status: 500 }
      );
    }

    return Response.json({ session: checkoutSession }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      {
        error: { code: "internal-error", message: "Error processing request" },
      },
      { status: 500 }
    );
  }
}
