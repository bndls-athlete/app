import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";
import { getTierManager } from "@/helpers/tierManagerUtils";

export async function POST(request: Request) {
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
    const athlete = await AthleteModel.findOne({ userId: authUser.userId });

    if (
      !athlete ||
      !athlete.stripeCustomerId ||
      !athlete.stripeSubscriptionId
    ) {
      return new Response(
        JSON.stringify({
          error: {
            code: "athlete-not-found",
            message: "Athlete not found or missing Stripe subscription data.",
          },
        }),
        { status: 404 }
      );
    }

    const body = await request.json();
    const manager = getTierManager(athlete.registrationType);
    const hasAccess = manager.checkAthleteAccessToPurchase(
      athlete.athleteTier,
      body.newPriceId
    );

    if (!hasAccess) {
      return new Response(
        JSON.stringify({
          error: {
            code: "no-access",
            message: "You do not have access to this tier.",
          },
        }),
        { status: 403 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    const updatedSubscription = await stripe.subscriptions.update(
      athlete.stripeSubscriptionId,
      {
        payment_behavior: "pending_if_incomplete",
        proration_behavior: "always_invoice",
        items: [
          {
            id: athlete.stripeSubscriptionItemId,
            price: body.newPriceId,
          },
        ],
      }
    );

    return new Response(JSON.stringify({ updatedSubscription }), {
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
