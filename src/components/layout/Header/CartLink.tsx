"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { routes } from "@/config/site";
import { useCart } from "@/lib/cart";
import styles from "./Header.module.css";

/** Cart icon with the number of items in the browser cart. */
export function CartLink() {
  const count = useCart().length;
  return (
    <Link href={routes.cart} className={styles.cart} aria-label={count ? `Cart, ${count} items` : "Cart"}>
      <ShoppingCart size={24} aria-hidden="true" />
      {count ? (
        <span className={styles.badge} aria-hidden="true">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Link>
  );
}
