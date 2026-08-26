"use client";

import {
  FormEvent,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { loadStripe } from "@stripe/stripe-js";

import {
  CheckoutElementsProvider,
  PaymentElement,
  useCheckoutElements,
} from "@stripe/react-stripe-js/checkout";

import { useCart } from "@/components/StoreProvider";
import { money, store } from "@/lib/store";

type PaymentMethod =
  | "stripe"
  | "cash_on_delivery";

const publishableKey =
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

const stripePromise = publishableKey
  ? loadStripe(publishableKey)
  : null;

/* =========================================================
   STRIPE CARD FORM
========================================================= */

function StripePaymentForm({
  total,
  orderId,
  onBack,
}: {
  total: number;
  orderId: string;
  onBack: () => void;
}) {
  const checkoutState =
    useCheckoutElements();

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function pay(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (
      checkoutState.type !== "success"
    ) {
      return;
    }

    setLoading(true);

    try {
      await checkoutState.checkout.confirm({
        returnUrl:
          `${window.location.origin}/order-success` +
          `?order=${encodeURIComponent(orderId)}` +
          `&payment=stripe`,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Payment could not be completed."
      );

      setLoading(false);
    }
  }

  if (
    checkoutState.type === "loading"
  ) {
    return (
      <div className="checkout-form">
        <h2>Secure card payment</h2>

        <p className="fineprint">
          Loading secure payment form...
        </p>
      </div>
    );
  }

  if (
    checkoutState.type === "error"
  ) {
    return (
      <div className="checkout-form">
        <h2>Secure card payment</h2>

        <p className="error">
          {checkoutState.error.message}
        </p>

        <button
          type="button"
          className="button full"
          onClick={onBack}
        >
          Back to checkout
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={pay}
      className="checkout-form"
    >
      <h2>Credit / Debit Card</h2>

      <p className="fineprint">
        Enter your card details below.
        Your payment information is
        securely processed by Stripe.
      </p>

      <div
        style={{
          marginTop: "22px",
          marginBottom: "24px",
        }}
      >
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <button
        type="submit"
        className="button primary full"
        disabled={loading}
      >
        {loading
          ? "Processing payment..."
          : `Pay ${money(total)}`}
      </button>

      <button
        type="button"
        onClick={onBack}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: "14px",
          padding: "8px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        ← Back to checkout details
      </button>
    </form>
  );
}

/* =========================================================
   CHECKOUT PAGE
========================================================= */

export default function Checkout() {
  const {
    items,
    subtotal,
    clear,
  } = useCart();

  const router = useRouter();

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethod>("stripe");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    clientSecret,
    setClientSecret,
  ] =
    useState<string | null>(null);

  const [
    stripeOrderId,
    setStripeOrderId,
  ] =
    useState<string | null>(null);

  /*
   * PantryNest currently uses
   * free shipping on all orders.
   *
   * This also keeps the amount shown
   * here identical to the Stripe total.
   */
  const shipping = 0;

  const total =
    subtotal + shipping;

  async function submit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!items.length) {
      return;
    }

    setLoading(true);
    setError("");

    const form =
      new FormData(event.currentTarget);

    const customer =
      Object.fromEntries(
        form.entries()
      );

    const cartItems =
      items.map((item) => ({
        id: item.product.id,
        quantity: item.quantity,
      }));

    try {
      /* ===============================================
         STRIPE CARD PAYMENT
      =============================================== */

      if (
        paymentMethod === "stripe"
      ) {
        if (!publishableKey) {
          throw new Error(
            "Stripe publishable key is missing."
          );
        }

        const response =
          await fetch(
            "/api/stripe/checkout",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                customer,
                items: cartItems,
              }),
            }
          );

        const body =
          await response.json();

        if (
          !response.ok ||
          !body.clientSecret ||
          !body.orderId
        ) {
          throw new Error(
            body.error ||
              "Unable to initialize secure payment."
          );
        }

        setStripeOrderId(
          body.orderId
        );

        setClientSecret(
          body.clientSecret
        );

        setLoading(false);

        return;
      }

      /* ===============================================
         CASH ON DELIVERY
      =============================================== */

      const response =
        await fetch(
          "/api/orders",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              customer,
              items: cartItems,

              paymentMethod:
                "cash_on_delivery",
            }),
          }
        );

      const body =
        await response.json();

      if (!response.ok) {
        throw new Error(
          body.error ||
            "We could not place your order."
        );
      }

      clear();

      router.push(
        `/order-success?order=${encodeURIComponent(
          body.orderId
        )}&payment=cod`
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

  /* =====================================================
     EMPTY CART
  ===================================================== */

  if (!items.length) {
    return (
      <section className="section container">
        <h1>Checkout</h1>

        <div className="empty">
          <p>
            Your cart is empty.
          </p>

          <Link
            href="/shop"
            className="button primary"
          >
            Shop products
          </Link>
        </div>
      </section>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <section className="section container">
      <h1>Checkout</h1>

      <p className="lead small">
        Review your order and choose
        your payment method.
      </p>

      <div className="checkout-grid">

        {/* =============================================
            STRIPE PAYMENT ELEMENT
        ============================================= */}

        {clientSecret &&
        stripeOrderId ? (
          <div>
            <CheckoutElementsProvider
              stripe={stripePromise}
              options={{
                clientSecret,

                elementsOptions: {
                  appearance: {
                    theme: "stripe",

                    variables: {
                      borderRadius:
                        "8px",
                    },
                  },
                },
              }}
            >
              <StripePaymentForm
                total={total}
                orderId={
                  stripeOrderId
                }
                onBack={() => {
                  setClientSecret(
                    null
                  );

                  setStripeOrderId(
                    null
                  );
                }}
              />
            </CheckoutElementsProvider>
          </div>
        ) : (
          /* ===========================================
             CUSTOMER + PAYMENT SELECTION
          =========================================== */

          <form
            onSubmit={submit}
            className="checkout-form"
          >
            <h2>
              Contact & delivery
            </h2>

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
                  defaultValue={
                    store.country
                  }
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

            <h2>
              Payment
            </h2>

            {/* CARD */}

            <label className="payment-box">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={
                  paymentMethod ===
                  "stripe"
                }
                onChange={() =>
                  setPaymentMethod(
                    "stripe"
                  )
                }
              />

              <div>
                <strong>
                  Credit / Debit Card
                </strong>

                <p>
                  Visa, Mastercard and
                  other supported cards.
                  Payment is securely
                  processed by Stripe
                  without leaving this
                  website.
                </p>
              </div>
            </label>

            {/* COD */}

            <label className="payment-box">
              <input
                type="radio"
                name="paymentMethod"
                value="cash_on_delivery"
                checked={
                  paymentMethod ===
                  "cash_on_delivery"
                }
                onChange={() =>
                  setPaymentMethod(
                    "cash_on_delivery"
                  )
                }
              />

              <div>
                <strong>
                  Cash on Delivery (COD)
                </strong>

                <p>
                  Pay the full order
                  amount when your
                  parcel is delivered.
                </p>
              </div>
            </label>

            {/* TERMS */}

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
                </Link>

                {" "}and acknowledge the{" "}

                <Link href="/policies/returns">
                  Returns & Refunds Policy
                </Link>
                .
              </span>
            </label>

            {error && (
              <p className="error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="button primary full"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : paymentMethod ===
                    "stripe"
                  ? "Continue to card payment"
                  : "Place COD order"}
            </button>
          </form>
        )}

        {/* =============================================
            ORDER SUMMARY
        ============================================= */}

        <aside className="summary">
          <h2>Final total</h2>

          {items.map((item) => (
            <div
              key={item.product.id}
            >
              <span>
                {item.product.title}
                {" × "}
                {item.quantity}
              </span>

              <strong>
                {money(
                  item.product.price *
                    item.quantity
                )}
              </strong>
            </div>
          ))}

          <hr />

          <div>
            <span>
              Subtotal
            </span>

            <strong>
              {money(subtotal)}
            </strong>
          </div>

          <div>
            <span>
              Shipping
            </span>

            <strong>
              Free
            </strong>
          </div>

          <div className="total">
            <span>
              Total due
            </span>

            <strong>
              {money(total)}
            </strong>
          </div>

          <p className="fineprint">
            Estimated delivery:{" "}
            {store.shippingMinDays}–
            {store.shippingMaxDays}{" "}
            business days.
          </p>

          <p className="fineprint">
            Secure card payments are
            processed by Stripe.
          </p>
        </aside>
      </div>
    </section>
  );
}