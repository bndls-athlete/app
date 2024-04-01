import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import AthleteModel from "@/models/Athlete";

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
      !athlete.stripeSubscriptionId ||
      !athlete.priceId
    ) {
      return new Response(
        JSON.stringify({
          error: {
            code: "athlete-not-found",
            message: "Athlete not found or missing Stripe data.",
          },
        }),
        { status: 404 }
      );
    }

    const body = await request.json();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    // Set proration date to the current time
    const proration_date = Math.floor(Date.now() / 1000);

    // Preview the upcoming invoice
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: athlete.stripeCustomerId,
      subscription: athlete.stripeSubscriptionId,
      subscription_items: [
        {
          id: athlete.stripeSubscriptionItemId,
          price: body.newPriceId,
        },
      ],
      subscription_proration_date: proration_date,
      subscription_proration_behavior: "always_invoice",
    });

    const netPriceDifference = invoice.total < 0 ? 0 : invoice.total / 100;

    return new Response(
      JSON.stringify({
        netPriceDifference,
        subscriptionProrationDate: proration_date,
      }),
      { status: 200 }
    );
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
