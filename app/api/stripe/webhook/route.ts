import Stripe from "stripe";
import dbConnect from "@/lib/dbConnect";
import AthleteModel, { Athlete } from "@/models/Athlete";
import { EntityType } from "@/types/entityTypes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

async function updateAthleteSubscriptionDetails(
  subscription: Stripe.Subscription,
  athlete: Athlete
) {
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

async function handlePendingUpdate(
  subscription: Stripe.Subscription,
  customer: Stripe.Customer
) {
  if (subscription.pending_update && "email" in customer && customer.email) {
    // Send an email to the user about the pending update
    // const emailBody = "Your subscription update is pending due to a payment issue. Please update your payment method.";
    // await sendEmail(customer.email, "Subscription Update Pending", emailBody);
    // console.log(`Email sent to ${customer.email} about pending subscription update.`);
  }
}

export async function POST(request: Request) {
  await dbConnect();

  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

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
    const customerId =
      typeof event.data.object === "object" && "customer" in event.data.object
        ? event.data.object.customer
        : null;
    if (!customerId || typeof customerId !== "string") {
      console.error("Customer ID not found or invalid in event data");
      return new Response(
        JSON.stringify({
          error: { message: "Customer ID not found or invalid" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const customer = await stripe.customers.retrieve(customerId);
    if (!("metadata" in customer) || typeof customer.metadata !== "object") {
      console.error("Customer metadata not found or invalid");
      return new Response(
        JSON.stringify({
          error: { message: "Customer metadata not found or invalid" },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (customer.metadata.userType === EntityType.Athlete) {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object as Stripe.Checkout.Session;
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
          // if (athlete.stripeSubscriptionId === subscription.id) {
          await updateAthleteSubscriptionDetails(subscription, athlete);
          // }
          break;
        case "customer.subscription.deleted":
        case "customer.subscription.updated":
          const updatedSubscription = event.data.object as Stripe.Subscription;
          const updatedAthlete = await AthleteModel.findOne({
            stripeCustomerId: updatedSubscription.customer as string,
          });
          if (!updatedAthlete) {
            console.warn(
              "Athlete not found for customer ID:",
              updatedSubscription.customer
            );
            return new Response(
              JSON.stringify({ error: { message: "Athlete not found" } }),
              { status: 404, headers: { "Content-Type": "application/json" } }
            );
          }
          if (updatedAthlete.stripeSubscriptionId === updatedSubscription.id) {
            await updateAthleteSubscriptionDetails(
              updatedSubscription,
              updatedAthlete
            );
            await handlePendingUpdate(updatedSubscription, customer);
          }
          break;
        default:
          console.log(`Received irrelevant event type: ${event.type}`);
          return new Response(
            JSON.stringify({
              message: "Event type is not relevant to this webhook.",
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
      }
    } else {
      console.log(
        `Event for unsupported userType: ${customer.metadata.userType}`
      );
      // Add handling for other userTypes such as 'Company' here if needed in the future
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
