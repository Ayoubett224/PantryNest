import { store } from "@/lib/store";

export default function FAQ() {
  return (
    <section className="section container narrow prose">
      <p className="eyebrow">Help</p>
      <h1>Frequently asked questions</h1>

      <h2>How long does delivery take?</h2>

      <p>
        Our current standard delivery estimate is{" "}
        {store.shippingMinDays}–{store.shippingMaxDays} business days.
        See our Shipping Policy for more information.
      </p>

      <h2>How much is shipping?</h2>

      <p>
        Standard shipping is free on all PantryNest orders.
        There is no minimum purchase requirement.
      </p>

      <h2>How do I pay?</h2>

      <p>
        PantryNest accepts secure credit and debit card payments
        processed by Stripe. Card details are entered securely during
        checkout.
      </p>

      <h2>Does PantryNest store my card number?</h2>

      <p>
        No. Card information is securely handled by Stripe.
        PantryNest does not directly receive or store your full card
        number or card security code.
      </p>

      <h2>Can I return an item?</h2>

      <p>
        Eligible items may be returned within {store.returnDays} days
        under our Returns & Refunds Policy.
      </p>

      <h2>How can I contact the store?</h2>

      <p>
        Email {store.email} or call {store.phone}. Our business details
        are also available on the About and Contact pages.
      </p>
    </section>
  );
}