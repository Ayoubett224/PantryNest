import { NextResponse } from "next/server";
import Stripe from "stripe";

import { products } from "@/lib/products";
import { store } from "@/lib/store";
import type { Product } from "@/lib/types";

const clean = (value: unknown, max = 180) =>
  typeof value === "string"
    ? value.trim().slice(0, max)
    : "";

type CartItem = {
  id?: unknown;
  quantity?: unknown;
};

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      console.error("STRIPE_SECRET_KEY is missing");

      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const body = await request.json();

    const customer = body?.customer ?? {};
    const rawItems: CartItem[] = Array.isArray(body?.items)
      ? body.items
      : [];

    const name = clean(customer.name);
    const email = clean(customer.email);
    const phone = clean(customer.phone);
    const country = clean(customer.country).toUpperCase();
    const address = clean(customer.address);
    const city = clean(customer.city);
    const region = clean(customer.region);
    const postalCode = clean(customer.postalCode);

    if (
      !name ||
      !email ||
      !email.includes("@") ||
      !phone ||
      !country ||
      !address ||
      !city ||
      !region ||
      !postalCode ||
      customer.termsAccepted !== "yes"
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete all required checkout fields and accept the terms.",
        },
        { status: 400 }
      );
    }

    if (rawItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const normalizedItems: {
      product: Product;
      quantity: number;
    }[] = rawItems.map((item) => {
      const productId = clean(item.id, 100);

      const product = products.find(
        (p) => p.id === productId
      );

      if (
        !product ||
        product.availability !== "in_stock"
      ) {
        throw new Error("INVALID_ITEM");
      }

      const requestedQuantity = Number(item.quantity);

      const quantity = Number.isFinite(requestedQuantity)
        ? Math.max(
            1,
            Math.min(
              10,
              Math.floor(requestedQuantity)
            )
          )
        : 1;

      return {
        product,
        quantity,
      };
    });

    const orderId =
      `PN-${Date.now().toString(36).toUpperCase()}-` +
      crypto.randomUUID().slice(0, 6).toUpperCase();

    const session =
      await stripe.checkout.sessions.create({
        mode: "payment",

        // Stripe Payment Element stays inside PantryNest.
        ui_mode: "elements",

        payment_method_types: ["card"],

        customer_email: email,

        client_reference_id: orderId,

        line_items: normalizedItems.map(
          ({ product, quantity }) => ({
            quantity,

            price_data: {
              currency: product.currency.toLowerCase(),

              unit_amount: Math.round(
                product.price * 100
              ),

              product_data: {
                name: product.title,

                description:
                  product.description,

                images: product.image
                  ? [product.image]
                  : undefined,

                metadata: {
                  product_id: product.id,
                },
              },
            },
          })
        ),

        return_url:
          `${store.url}/order-success` +
          `?order=${encodeURIComponent(orderId)}` +
          `&payment=stripe` +
          `&session_id={CHECKOUT_SESSION_ID}`,

        metadata: {
          order_id: orderId,

          customer_name: name,
          customer_email: email,
          customer_phone: phone,

          customer_country: country,
          customer_address: address,
          customer_city: city,
          customer_region: region,
          customer_postal_code: postalCode,
        },

        payment_intent_data: {
          metadata: {
            order_id: orderId,
          },
        },
      });

    if (!session.client_secret) {
      console.error(
        "Stripe Checkout Session has no client secret:",
        session.id
      );

      return NextResponse.json(
        {
          error:
            "Unable to initialize secure card payment.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      clientSecret: session.client_secret,
      orderId,
      sessionId: session.id,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_ITEM"
    ) {
      return NextResponse.json(
        {
          error:
            "One or more products are unavailable.",
        },
        { status: 400 }
      );
    }

    console.error(
      "Stripe Checkout Session error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to start Stripe payment.",
      },
      { status: 500 }
    );
  }
}