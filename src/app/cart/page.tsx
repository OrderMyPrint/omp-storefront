import type { Metadata } from "next";
import { CartView } from "@/components/cart/CartView";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import listing from "../listing.module.css";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

/** SF-CART-01 · Cart. */
export default function CartPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      <div className={`container ${listing.page}`}>
        <PageIntro title="Your cart" />
        <CartView />
      </div>
    </>
  );
}
