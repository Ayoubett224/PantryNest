import Link from "next/link";
import type { Product } from "@/lib/types";
import { money } from "@/lib/store";

export default function ProductCard({ product }: { product: Product }) {
  return <article className="product-card">
    <Link href={`/product/${product.slug}`} className="product-image-wrap">
      <img src={product.image} alt={product.title} className="product-image" />
    </Link>
    <div className="product-card-body">
      <p className="eyebrow">{product.category}</p>
      <h3><Link href={`/product/${product.slug}`}>{product.title}</Link></h3>
      <div className="product-row">
        <strong>{money(product.price, product.currency)}</strong>
        <span className={product.availability === "in_stock" ? "stock in" : "stock out"}>{product.availability === "in_stock" ? "In stock" : "Out of stock"}</span>
      </div>
    </div>
  </article>;
}
