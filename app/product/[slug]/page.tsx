import { notFound } from "next/navigation";
import type { Metadata } from "next";
import AddToCartButton from "@/components/AddToCartButton";
import { getProductBySlug, products } from "@/lib/products";
import { absoluteImageUrl, money, store } from "@/lib/store";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = getProductBySlug(slug);

  if (!p) return {};

  return {
    title: p.title,
    description: p.description,
    alternates: {
      canonical: `/product/${p.slug}`,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getProductBySlug(slug);

  if (!p) notFound();

  const availabilityUrl =
    p.availability === "in_stock"
      ? "https://schema.org/InStock"
      : p.availability === "preorder"
        ? "https://schema.org/PreOrder"
        : p.availability === "backorder"
          ? "https://schema.org/BackOrder"
          : "https://schema.org/OutOfStock";

  const conditionUrl =
    p.condition === "new"
      ? "https://schema.org/NewCondition"
      : p.condition === "used"
        ? "https://schema.org/UsedCondition"
        : "https://schema.org/RefurbishedCondition";

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    description: p.description,
    image: [absoluteImageUrl(p.image)],
    sku: p.id,
    brand: {
      "@type": "Brand",
      name: p.brand,
    },
    offers: {
      "@type": "Offer",
      url: `${store.url}/product/${p.slug}`,
      priceCurrency: p.currency,
      price: p.price.toFixed(2),
      availability: availabilityUrl,
      itemCondition: conditionUrl,
    },
  };

  if (p.gtin) schema.gtin = p.gtin;
  if (p.mpn) schema.mpn = p.mpn;

  return (
    <section className="section container product-detail">
      <div className="product-detail-image">
        <img src={p.image} alt={p.title} />
      </div>

      <div>
        <p className="eyebrow">{p.category}</p>

        <h1>{p.title}</h1>

        <p className="price-lg">
          {money(p.price, p.currency)}
        </p>

        <p className="availability">
          {p.availability === "in_stock"
            ? "In stock and available to order"
            : "Currently unavailable"}
        </p>

        <p className="lead small">
          {p.description}
        </p>

        <div className="policy-summary">
          <p>
            <strong>Condition:</strong> {p.condition}
          </p>

          <p>
            <strong>Delivery estimate:</strong>{" "}
            {store.shippingMinDays}–{store.shippingMaxDays} business days
          </p>

          <p>
            <strong>Returns:</strong> within {store.returnDays} days under
            the return policy
          </p>
        </div>

        <AddToCartButton product={p} />

        <p className="fineprint">
          Free standard shipping on all orders.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
    </section>
  );
}