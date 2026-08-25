"use client";

import Link from "next/link";
import { useCart } from "@/components/StoreProvider";
import { store } from "@/lib/store";

export default function Header() {
  const { count } = useCart();
  return <>
    <div className="announcement">Clear pricing • Policy links on every page • Customer support before and after purchase</div>
    <header className="header container">
      <Link className="brand" href="/">{store.name}</Link>
      <nav className="nav" aria-label="Main navigation">
        <Link href="/shop">Shop</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link className="cart-link" href="/cart">Cart <span>{count}</span></Link>
      </nav>
    </header>
  </>;
}
