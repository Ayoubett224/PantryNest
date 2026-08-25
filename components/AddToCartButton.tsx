"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/StoreProvider";
import type { Product } from "@/lib/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const disabled = product.availability !== "in_stock";

  function handleAddToCart() {
    if (disabled || adding) return;

    setAdding(true);
    add(product);

    // Make the action obvious to the customer by taking them to the cart.
    // The StoreProvider lives in the root layout, so the cart state is
    // preserved during this client-side navigation.
    router.push("/cart");
  }

  return (
    <button
      type="button"
      className="button primary full"
      disabled={disabled || adding}
      onClick={handleAddToCart}
      aria-label={`Add ${product.title} to cart`}
    >
      {disabled ? "Unavailable" : adding ? "Adding…" : "Add to cart"}
    </button>
  );
}
