import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secretKey =
    process.env.STRIPE_SECRET_KEY;

  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
    console.error(
      "Stripe webhook environment variables are missing."
    );

    return NextResponse.json(
      { error: "Webhook is not configured." },
      { status: 500 }
    );
  }

  const signature =
    request.headers.get(
      "stripe-signature"
    );

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature." },
      { status: 400 }
    );
  }

  const stripe =
    new Stripe(secretKey);

  const rawBody =
    await request.text();

  let event: Stripe.Event;

  try {
    event =
      stripe.webhooks.constructEvent(
        rawBody,
        signature,
        webhookSecret
      );
  } catch (error) {
    console.error(
      "Stripe webhook verification failed:",
      error
    );

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (
    event.type ===
    "checkout.session.completed"
  ) {
    const session =
      event.data.object as Stripe.Checkout.Session;

    if (
      session.payment_status === "paid"
    ) {
      console.log(
        "STRIPE ORDER PAID:",
        {
          sessionId: session.id,
          orderId:
            session.metadata?.order_id,
          customerEmail:
            session.customer_details
              ?.email,
          amountTotal:
            session.amount_total,
          currency:
            session.currency,
        }
      );

      /*
       * NEXT STEP:
       * save order to database /
       * send fulfillment email.
       */
    }
  }

  return NextResponse.json({
    received: true,
  });
}