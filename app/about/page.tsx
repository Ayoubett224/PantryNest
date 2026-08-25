import type { Metadata } from "next";
import { businessDisplayName, store } from "@/lib/store";

export const metadata: Metadata = { title: "About us" };

export default function About() {
  return <section className="section container narrow prose">
    <p className="eyebrow">About us</p>
    <h1>About {store.name}</h1>
    <p>{store.name} is a kitchen and pantry organization store offering practical physical products designed to make everyday storage simpler and easier to manage.</p>
    <p>We aim to keep product information, prices, stock status, shipping terms, and return conditions clear before customers place an order.</p>
    <h2>Business information</h2>
    <p>
      {store.legalName ? <><strong>Legal business name:</strong> {businessDisplayName}<br/></> : null}
      <strong>Business address:</strong> {store.address}<br/>
      <strong>Support email:</strong> <a href={`mailto:${store.email}`}>{store.email}</a><br/>
      <strong>Support phone:</strong> <a href={`tel:${store.phone.replace(/\s/g, "")}`}>{store.phone}</a>
    </p>
    <p>If any information on a product page appears unclear, please contact us before placing the order.</p>
  </section>;
}
