import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
import { store, money } from "@/lib/store";

export default function Home() {
  return <>
    <section className="hero container">
      <div>
        <p className="eyebrow">Kitchen & pantry organization</p>
        <h1>Simple storage for a more organized kitchen.</h1>
        <p className="lead">{store.description}</p>
        <div className="hero-actions"><Link className="button primary" href="/shop">Shop all products</Link><Link className="button secondary" href="/about">About our store</Link></div>
      </div>
      <div className="hero-card">
        <strong>Shopping information at a glance</strong>
        <dl>
          <div><dt>Standard delivery</dt><dd>{store.shippingMinDays}–{store.shippingMaxDays} business days</dd></div>
          <div><dt>Shipping</dt><dd>Free shipping on all orders</dd></div>
          <div><dt>Returns</dt><dd>Accepted within {store.returnDays} days under our return policy</dd></div>
          <div><dt>Support</dt><dd>{store.email}</dd></div>
        </dl>
      </div>
    </section>
    <section className="section container">
      <div className="section-heading"><div><p className="eyebrow">Catalog</p><h2>Featured products</h2></div><Link href="/shop">View all →</Link></div>
      <div className="product-grid">{products.slice(0,4).map((p)=><ProductCard product={p} key={p.id}/>)}</div>
    </section>
    <section className="trust-strip">
      <div className="container trust-grid">
        <div><h3>Transparent pricing</h3><p>Product prices are shown clearly before checkout.</p></div>
        <div><h3>Policy access</h3><p>Shipping, returns, privacy, and terms are linked from every page.</p></div>
        <div><h3>Reachable support</h3><p>Email and phone contact details are visible before purchase.</p></div>
      </div>
    </section>
  </>;
}
