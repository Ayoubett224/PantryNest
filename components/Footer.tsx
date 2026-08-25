import Link from "next/link";
import { businessDisplayName, store } from "@/lib/store";

export default function Footer() {
  return <footer className="footer">
    <div className="container footer-grid">
      <section>
        <h3>{store.name}</h3>
        <p>{store.description}</p>
        {store.legalName ? <p><strong>Legal business:</strong> {store.legalName}</p> : null}
        <p><strong>Address:</strong> {store.address}</p>
      </section>
      <section>
        <h3>Customer care</h3>
        <Link href="/contact">Contact us</Link>
        <Link href="/faq">FAQ</Link>
        <a href={`mailto:${store.email}`}>{store.email}</a>
        <a href={`tel:${store.phone.replace(/\s/g, "")}`}>{store.phone}</a>
      </section>
      <section>
        <h3>Policies</h3>
        <Link href="/policies/shipping">Shipping policy</Link>
        <Link href="/policies/returns">Returns & refunds</Link>
        <Link href="/policies/privacy">Privacy policy</Link>
        <Link href="/policies/terms">Terms & conditions</Link>
      </section>
    </div>
    <div className="container footer-bottom">© {new Date().getFullYear()} {businessDisplayName}. All rights reserved.</div>
  </footer>;
}
