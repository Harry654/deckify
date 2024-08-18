import { db } from "@/lib/firebase/config"; // Adjust the path to your config file
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-06-20",
});

export async function POST(request: NextRequest) {
  const sig = request.headers.get("stripe-signature") || "";
  const body = await request.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || "",
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const metadata = event.data.object.metadata;

      if (metadata && "userId" in metadata && "product_id" in metadata) {
        const { userId, product_id: plan_id } = metadata;
        console.log("checkout.session.completed was successful!");

        // Reference the user's document in Firestore
        const userDocRef = doc(db, "users", userId);

        // Update the user's document with the plan information
        await updateDoc(userDocRef, {
          plan: plan_id, // Assuming there's a single plan
          planActive: true,
          planStartDate: new Date(),
        });
      } else {
        // Handle the error case where metadata, userId, or product_id is missing
        return NextResponse.json(
          { error: `Either user ID or product ID is missing` },
          { status: 400 },
        );
      }

      break;
    // ... handle other event types
    default:
    // console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
