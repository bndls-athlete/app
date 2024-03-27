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

    // Retrieve the current subscription
    const subscription = await stripe.subscriptions.retrieve(
      athlete.stripeSubscriptionId
    );

    // Preview the proration
    const invoice = await stripe.invoices.retrieveUpcoming({
      customer: athlete.stripeCustomerId,
      subscription: athlete.stripeSubscriptionId,
      subscription_items: [
        {
          id: subscription.items.data[0].id,
          price: body.newPriceId,
        },
      ],
      subscription_proration_date: proration_date,
    });

    // Extract and convert the subtotal amount from the invoice
    const prorationSubtotal = invoice.subtotal / 100;

    console.log(prorationSubtotal);

    return new Response(JSON.stringify({ prorationSubtotal }), { status: 200 });
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
