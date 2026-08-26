"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/StoreProvider";
import { money, store } from "@/lib/store";

type PaymentMethod = "stripe" | "cash_on_delivery";

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("stripe");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shipping = useMemo(
    () =>
      subtotal === 0
        ? 0
        : subtotal >= store.freeShippingThreshold
          ? 0
          : store.shippingFee,
    [subtotal]
  );

  const total = subtotal + shipping;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!items.length) return;

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    const customer = Object.fromEntries(form.entries());

    const cartItems = items.map((x) => ({
      id: x.product.id,
      quantity: x.quantity,
    }));

    try {
      if (paymentMethod === "stripe") {
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer,
            items: cartItems,
          }),
        });

        const body = await res.json();

        if (!res.ok || !body.url) {
          throw new Error(
            body.error || "Unable to start secure payment."
          );
        }

        window.location.href = body.url;
        return;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          items: cartItems,
          paymentMethod: "cash_on_delivery",
        }),
      });

      const body = await res.json();

      if (!res.ok) {
        throw new Error(
          body.error || "We could not place your order."
        );
      }

      clear();

      router.push(
        `/order-success?order=${encodeURIComponent(body.orderId)}`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );

      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <section className="section container">
        <h1>Checkout</h1>

        <div className="empty">
          <p>Your cart is empty.</p>

          <Link href="/shop" className="button primary">
            Shop products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section container">
      <h1>Checkout</h1>

      <p className="lead small">
        Review your order and choose your payment method.
      </p>

      <div className="checkout-grid">
        <form onSubmit={submit} className="checkout-form">
          <h2>Contact & delivery</h2>

          <div className="form-grid">
            <label>
              Full name
              <input
                name="name"
                required
                autoComplete="name"
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
              />
            </label>

            <label>
              Phone
              <input
                name="phone"
                required
                autoComplete="tel"
              />
            </label>

            <label>
              Country
              <input
                name="country"
                required
                defaultValue={store.country}
                autoComplete="country-name"
              />
            </label>

            <label className="wide">
              Street address
              <input
                name="address"
                required
                autoComplete="street-address"
              />
            </label>

            <label>
              City
              <input
                name="city"
                required
                autoComplete="address-level2"
              />
            </label>

            <label>
              State / Region
              <input
                name="region"
                required
                autoComplete="address-level1"
              />
            </label>

            <label>
              Postal code
              <input
                name="postalCode"
                required
                autoComplete="postal-code"
              />
            </label>
          </div>

          <h2>Payment</h2>

          <label className="payment-box">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "stripe"}
              onChange={() => setPaymentMethod("stripe")}
            />

            <div>
              <strong>Credit / Debit Card</strong>

              <p>
                Pay securely online with Stripe.
              </p>
            </div>
          </label>

          <label className="payment-box">
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === "cash_on_delivery"}
              onChange={() =>
                setPaymentMethod("cash_on_delivery")
              }
            />

            <div>
              <strong>Cash on Delivery (COD)</strong>

              <p>
                Pay the full order total when your parcel
                is delivered.
              </p>
            </div>
          </label>

          <label className="check">
            <input
              type="checkbox"
              name="termsAccepted"
              value="yes"
              required
            />

            <span>
              I agree to the{" "}
              <Link href="/policies/terms">
                Terms & Conditions
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/policies/returns">
                Returns & Refunds Policy
              </Link>.
            </span>
          </label>

          {error && <p className="error">{error}</p>}

          <button
            className="button primary full"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : paymentMethod === "stripe"
                ? "Continue to secure payment"
                : "Place COD order"}
          </button>
        </form>

        <aside className="summary">
          <h2>Final total</h2>

          {items.map((x) => (
            <div key={x.product.id}>
              <span>
                {x.product.title} × {x.quantity}
              </span>

              <strong>
                {money(x.product.price * x.quantity)}
              </strong>
            </div>
          ))}

          <hr />

          <div>
            <span>Subtotal</span>
            <strong>{money(subtotal)}</strong>
          </div>

          <div>
            <span>Shipping</span>
            <strong>
              {shipping === 0 ? "Free" : money(shipping)}
            </strong>
          </div>

          <div className="total">
            <span>Total due</span>
            <strong>{money(total)}</strong>
          </div>

          <p className="fineprint">
            Estimated delivery: {store.shippingMinDays}–
            {store.shippingMaxDays} business days.
          </p>
        </aside>
      </div>
    </section>
  );
}