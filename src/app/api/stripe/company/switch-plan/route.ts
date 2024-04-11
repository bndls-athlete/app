import Stripe from "stripe";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import BrandModel from "@/models/Brand";

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
    const brand = await BrandModel.findOne({ userId: authUser.userId });

    if (!brand || !brand.stripeCustomerId || !brand.stripeSubscriptionId) {
      return new Response(
        JSON.stringify({
          error: {
            code: "brand-not-found",
            message: "Brand not found or missing Stripe subscription data.",
          },
        }),
        { status: 404 }
      );
    }

    const body = await request.json();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2023-10-16",
    });

    const updatedSubscription = await stripe.subscriptions.update(
      brand.stripeSubscriptionId,
      {
        payment_behavior: "pending_if_incomplete",
        proration_behavior: "always_invoice",
        items: [
          {
            id: brand.stripeSubscriptionItemId,
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
