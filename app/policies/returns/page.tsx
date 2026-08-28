import { businessDisplayName, store } from "@/lib/store";

export default function Returns() {
  return (
    <section className="section container narrow prose">
      <p className="eyebrow">Store policy</p>

      <h1>Returns & Refunds Policy</h1>

      <p>
        <strong>Last updated:</strong> August 28, 2026
      </p>

      <h2>Return window</h2>

      <p>
        We accept eligible return requests within {store.returnDays} days
        of delivery, provided the item is returned in substantially the
        same condition in which it was received.
      </p>

      <h2>How to start a return</h2>

      <p>
        Before returning an item, contact us at{" "}
        <a href={`mailto:${store.email}`}>{store.email}</a>.
        Please include your order number and the reason for the return.
      </p>

      <p>
        We will confirm the return instructions before the item is sent
        back.
      </p>

      <h2>Return address</h2>

      <p>
        <strong>{store.returnAddress}</strong>
      </p>

      <p>
        Please contact us before sending a return so we can confirm the
        return and provide any necessary instructions.
      </p>

      <h2>Return shipping costs</h2>

      <p>
        For change-of-mind returns, the customer is responsible for the
        cost of returning the item unless we state otherwise.
      </p>

      <p>
        If an item arrives damaged, defective, or materially different
        from what was ordered, contact us as soon as possible. If the
        claim is accepted, we will provide an appropriate remedy and may
        cover reasonable return shipping costs.
      </p>

      <h2>Refunds</h2>

      <p>
        Once an eligible return is received and inspected, we will notify
        you whether the refund has been approved.
      </p>

      <p>
        Approved refunds are issued to the original payment method used
        for the order. Card refunds are processed through Stripe.
      </p>

      <p>
        After a refund is issued, your bank or card provider may require
        additional processing time before the funds appear in your
        account.
      </p>

      <h2>Non-returnable items</h2>

      <p>
        Items that have been materially used, altered, damaged after
        delivery, or returned incomplete may be refused where permitted
        by applicable law.
      </p>

      <p>
        Any product-specific return exception will be disclosed before
        purchase.
      </p>

      <h2>Contact</h2>

      <p>
        {businessDisplayName}
        <br />
        {store.address}
        <br />
        <a href={`mailto:${store.email}`}>{store.email}</a>
        <br />
        <a href={`tel:${store.phone.replace(/\s/g, "")}`}>
          {store.phone}
        </a>
      </p>
    </section>
  );
}