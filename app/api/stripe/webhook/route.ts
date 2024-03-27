import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import AthleteModel, { Athlete } from "@/models/Athlete";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export enum EntityType {
  Company = "company",
  Team = "team",
  Athlete = "athlete",
}

async function updateAthleteSubscriptionDetails(
  subscription: Stripe.Subscription,
  athlete: Athlete
) {
  // console.log(subscription.cancel_at_period_end);
  athlete.subscriptionStatus = subscription.status;
  athlete.stripeSubscriptionId = subscription.id;
  athlete.priceId = subscription.items.data[0].price.id;
  athlete.stripeSubscriptionItemId = subscription.items.data[0].id;
  athlete.subscriptionStartDate = new Date(subscription.start_date * 1000);
  athlete.subscriptionEndDate = new Date(
    subscription.current_period_end * 1000
  );
  athlete.cancelAtPeriodEnd = subscription.cancel_at_period_end;
  await athlete.save();
}

export async function POST(request: Request) {
  await dbConnect();

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`
    );
    return new Response(
      JSON.stringify({
        error: {
          message: `Webhook Error: ${
            err instanceof Error ? err.message : "Unknown error"
          }`,
        },
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );
      const athlete = await AthleteModel.findOne({
        stripeCustomerId: subscription.customer as string,
      });
      if (!athlete) {
        console.warn(
          "Athlete not found for customer ID:",
          subscription.customer
        );
        return new Response(
          JSON.stringify({ error: { message: "Athlete not found" } }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      console.log(event.type, subscription.status, subscription.id);
      await updateAthleteSubscriptionDetails(subscription, athlete);
    } else if (event.type.startsWith("customer.subscription.")) {
      const subscription = event.data.object as Stripe.Subscription;
      const athlete = await AthleteModel.findOne({
        stripeCustomerId: subscription.customer as string,
      });
      console.log(event.type, subscription.status, subscription.id);
      if (!athlete) {
        console.warn(
          "Athlete not found for customer ID:",
          subscription.customer
        );
        return new Response(
          JSON.stringify({ error: { message: "Athlete not found" } }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      await updateAthleteSubscriptionDetails(subscription, athlete);
    } else {
      console.log(`Received irrelevant event type: ${event.type}`);
      return new Response(
        JSON.stringify({
          message: "Event type is not relevant to this webhook.",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(
      `Error in webhook handling: ${
        err instanceof Error ? err.message : "Unknown error"
      }`
    );
    return new Response(
      JSON.stringify({ error: { message: "Server error" } }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
