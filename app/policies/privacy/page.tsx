import { businessDisplayName, store } from "@/lib/store";

export default function Privacy() {
  return (
    <section className="section container narrow prose">
      <p className="eyebrow">Store policy</p>
      <h1>Privacy Policy</h1>

      <p>
        <strong>Last updated:</strong> August 28, 2026
      </p>

      <p>
        This policy explains how {businessDisplayName} handles
        information submitted through {store.name}.
      </p>

      <h2>Information we collect</h2>

      <p>
        When you place an order or contact us, we may collect your name,
        email address, phone number, delivery address, order details,
        and information contained in customer-support messages.
      </p>

      <h2>Payment information</h2>

      <p>
        Card payments are securely processed by Stripe. PantryNest does
        not directly receive or store your full card number, expiration
        date, or card security code.
      </p>

      <h2>Why we use your information</h2>

      <p>
        We use customer information to process orders, arrange delivery,
        provide customer service, prevent misuse and fraud, maintain
        appropriate business records, and meet applicable legal
        obligations.
      </p>

      <h2>Sharing</h2>

      <p>
        We do not sell customer contact information. We may share
        information when reasonably necessary with service providers
        involved in payment processing, website hosting, delivery,
        communications, fraud prevention, accounting, or legal
        compliance.
      </p>

      <h2>Retention and security</h2>

      <p>
        We retain information only for as long as reasonably necessary
        for the purposes described above and apply reasonable technical
        and organizational measures to protect it.
      </p>

      <h2>Your choices</h2>

      <p>
        Depending on applicable law, you may have rights to request
        access, correction, deletion, restriction, or other handling
        of your personal information. Contact us to make a request.
      </p>

      <h2>Contact</h2>

      <p>
        {businessDisplayName}
        <br />
        {store.address}
        <br />
        {store.email}
        <br />
        {store.phone}
      </p>
    </section>
  );
}