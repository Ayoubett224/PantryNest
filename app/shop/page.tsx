import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";
export const metadata:Metadata={title:"Shop"};
export default function Shop(){return <section className="section container"><p className="eyebrow">All products</p><h1>Shop</h1><p className="lead small">All prices and stock statuses shown here are the same values used on each product page.</p><div className="product-grid">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div></section>}
