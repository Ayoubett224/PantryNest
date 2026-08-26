import { NextResponse } from "next/server";
import Stripe from "stripe";
import { products } from "@/lib/products";
import { store } from "@/lib/store";
import type { Product } from "@/lib/types";

const clean = (value: unknown, max = 180) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const body = await request.json();
    const customer = body?.customer || {};
    const rawItems = Array.isArray(body?.items) ? body.items : [];

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
      !email.includes("@") ||
      !phone ||
      !country ||
      !address ||
      !city ||
      !postalCode ||
      customer.termsAccepted !== "yes"
    ) {
      return NextResponse.json(
        { error: "Please complete all checkout fields." },
        { status: 400 }
      );
    }

    if (!rawItems.length) {
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    const normalizedItems: {
      product: Product;
      quantity: number;
    }[] = rawItems.map((item: any) => {
      const product = products.find(
        (p) => p.id === clean(item.id, 80)
      );

      if (!product || product.availability !== "in_stock") {
        throw new Error("INVALID_ITEM");
      }

      const quantity = Math.max(
        1,
        Math.min(10, Number(item.quantity) || 1)
      );

      return {
        product,
        quantity,
      };
    });

    const orderId =
      `PN-${Date.now().toString(36).toUpperCase()}-` +
      crypto.randomUUID().slice(0, 6).toUpperCase();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      // IMPORTANT:
      // payment form stays inside PantryNest
      ui_mode: "custom",

      payment_method_types: ["card"],

      customer_email: email,

      line_items: normalizedItems.map(
        ({ product, quantity }) => ({
          quantity,
          price_data: {
            currency: product.currency.toLowerCase(),
            unit_amount: Math.round(product.price * 100),

            product_data: {
              name: product.title,
              description: product.description,
              images: product.image
                ? [product.image]
                : undefined,
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
        customer_phone: phone,
        customer_country: country,
        customer_address: address,
        customer_city: city,
        customer_region: region,
        customer_postal_code: postalCode,
      },
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Unable to initialize Stripe payment." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      clientSecret: session.client_secret,
      orderId,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "INVALID_ITEM"
    ) {
      return NextResponse.json(
        { error: "One or more products are unavailable." },
        { status: 400 }
      );
    }

    console.error("Stripe checkout error:", error);

    return NextResponse.json(
      { error: "Unable to start Stripe payment." },
      { status: 500 }
    );
  }
}