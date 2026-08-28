import { businessDisplayName, store } from "@/lib/store";

export default function Terms() {
  return (
    <section className="section container narrow prose">
      <p className="eyebrow">Store policy</p>
      <h1>Terms & Conditions</h1>

      <p>
        <strong>Last updated:</strong> August 28, 2026
      </p>

      <h2>Seller</h2>

      <p>
        This website is operated by {businessDisplayName}, located at{" "}
        {store.address}.
        <br />
        Contact: {store.email}, {store.phone}.
      </p>

      <h2>Product information and pricing</h2>

      <p>
        We aim to describe product features, prices, condition, and
        availability accurately. The price shown at checkout is the
        amount charged for the order, subject to correction of obvious
        errors before an order is accepted.
      </p>

      <h2>Orders</h2>

      <p>
        An order is a request to purchase. We may reject or cancel an
        order if a product is unavailable, the delivery address cannot
        be served, information supplied is materially incorrect, fraud
        is suspected, or another legitimate reason prevents fulfillment.
      </p>

      <p>
        If an order is cancelled after payment has been collected,
        the applicable amount will be refunded.
      </p>

      <h2>Payment</h2>

      <p>
        PantryNest accepts secure online card payments. Credit and debit
        card payments are processed by Stripe.
      </p>

      <p>
        PantryNest does not directly receive or store full card numbers,
        card security codes, or expiration dates.
      </p>

      <p>
        The final order total is shown before payment is confirmed.
      </p>

      <h2>Shipping</h2>

      <p>
        Standard shipping is free on all orders. Delivery terms are
        described in our Shipping Policy.
      </p>

      <h2>Returns and refunds</h2>

      <p>
        Returns and refunds are governed by our Returns & Refunds Policy.
        That policy forms part of these terms.
      </p>

      <h2>Liability</h2>

      <p>
        Nothing in these terms excludes rights or remedies that cannot
        lawfully be excluded. To the extent permitted by law, we are
        not responsible for indirect losses that were not reasonably
        foreseeable from the transaction.
      </p>

      <h2>Contact</h2>

      <p>
        For questions about these terms, contact {store.email}.
      </p>
    </section>
  );
}