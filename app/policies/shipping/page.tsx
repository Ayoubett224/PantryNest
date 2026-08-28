import { businessDisplayName, store } from "@/lib/store";

export default function Shipping() {
  return (
    <section className="section container narrow prose">
      <p className="eyebrow">Store policy</p>
      <h1>Shipping Policy</h1>

      <p>
        <strong>Last updated:</strong> August 28, 2026
      </p>

      <h2>Where we ship</h2>

      <p>
        Orders are currently accepted for delivery within{" "}
        {store.country}. We do not accept an order if we cannot
        deliver to the address entered at checkout.
      </p>

      <h2>Shipping cost</h2>

      <p>
        PantryNest provides <strong>free standard shipping on all orders</strong>.
        There is no minimum purchase requirement.
      </p>

      <h2>Delivery estimate</h2>

      <p>
        Our standard delivery estimate is {store.shippingMinDays}–
        {store.shippingMaxDays} business days after an order is accepted.
        Business days exclude weekends and public holidays.
      </p>

      <p>
        Carrier delays, severe weather, incorrect delivery information,
        or other circumstances outside our reasonable control may extend
        the delivery time.
      </p>

      <h2>Address accuracy</h2>

      <p>
        Customers are responsible for entering a complete and accurate
        delivery address. If you notice an error after placing an order,
        contact us as soon as possible.
      </p>

      <h2>Contact</h2>

      <p>
        For shipping questions, contact {businessDisplayName} at{" "}
        {store.email} or {store.phone}.
      </p>
    </section>
  );
}