"use client";

import { CatalogueImage } from "@/components/catalogue/CatalogueImage";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import { PreLaunchNotice } from "@/components/ui/PreLaunchNotice/PreLaunchNotice";
import { routes } from "@/config/site";
import { removeFromCart, useCart } from "@/lib/cart";
import { formatINR, formatQuantity } from "@/lib/format";
import { roundToPaise } from "@/lib/pricing";
import { useState } from "react";
import styles from "./CartView.module.css";

const subscribeNothing = () => () => {};

/** SF-CART-01 · Cart (browser-stored until the order API exists). */
export function CartView() {
  const items = useCart();
  const hydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const [checkoutTried, setCheckoutTried] = useState(false);

  if (!hydrated) return <p className="t-body-m">Loading your cart…</p>;

  if (!items.length) {
    return (
      <div className={styles.empty}>
        <ShoppingCart size={40} aria-hidden="true" />
        <h2 className="t-h3">Your cart is empty</h2>
        <p className="t-body-m">Configure a product to see its price, then add it here.</p>
        <Button href={routes.products} variant="primary">
          Browse products
        </Button>
      </div>
    );
  }

  const subtotal = roundToPaise(items.reduce((sum, item) => sum + item.subtotal, 0));
  const gst = roundToPaise(items.reduce((sum, item) => sum + roundToPaise(item.subtotal * item.gstRate), 0));
  const total = roundToPaise(subtotal + gst);
  const rates = [...new Set(items.map((item) => Math.round(item.gstRate * 100)))].join(" / ");
  const pendingArtwork = items.filter((item) => item.artwork === "later" || !item.files.length).length;

  return (
    <div className={styles.layout}>
      <ul className={styles.items} aria-label="Items in your cart">
        {items.map((item) => (
          <li key={item.id} className={styles.item}>
            <div className={styles.thumb}>
              <CatalogueImage src={item.image} alt="" fill sizes="120px" />
            </div>
            <div className={styles.detail}>
              <h2 className="t-h5">
                <Link href={routes.product(item.slug)}>{item.name}</Link>
              </h2>
              <p className="t-label-m">
                {formatQuantity(item.quantity)} {item.unitLabel}
              </p>
              <ul className={`t-body-xs ${styles.options}`}>
                {item.options.map((option) => (
                  <li key={option}>{option}</li>
                ))}
              </ul>
              <p className={`t-body-xs ${item.files.length && item.artwork === "now" ? styles.ok : styles.warn}`}>
                {item.artwork === "later"
                  ? "Artwork: upload after checkout"
                  : item.files.length
                    ? `Artwork: ${item.files.join(" · ")}`
                    : "Artwork: not added yet"}
              </p>
            </div>
            <div className={styles.price}>
              <p className="t-price-m">{formatINR(item.subtotal)}</p>
              <p className="t-body-xs">excl. GST</p>
              <button type="button" className={`t-label-s ${styles.remove}`} onClick={() => removeFromCart(item.id)}>
                <Trash2 size={16} aria-hidden="true" /> Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <aside className={styles.summary} aria-labelledby="order-summary">
        <h2 id="order-summary" className="t-h4">
          Order summary
        </h2>
        <dl className={styles.lines}>
          <div>
            <dt className="t-body-m">Items ({items.length})</dt>
            <dd className="t-label-l">{formatINR(subtotal)}</dd>
          </div>
          <div>
            <dt className="t-body-m">GST ({rates}%)</dt>
            <dd className="t-label-l">{formatINR(gst)}</dd>
          </div>
          <div>
            <dt className="t-body-m">Delivery</dt>
            <dd className="t-body-m">Calculated at checkout</dd>
          </div>
        </dl>
        <div className={styles.total}>
          <span className="t-h5">Estimated total</span>
          <span className="t-price-l">{formatINR(total)}</span>
        </div>
        <p className="t-body-xs">
          Prices are estimates. Our server confirms the final price, with delivery, at checkout.
        </p>
        {pendingArtwork ? (
          <Alert
            tone="warning"
            title={`${pendingArtwork} ${pendingArtwork === 1 ? "item needs" : "items need"} artwork`}
          >
            You can upload it after checkout. Printing starts once artwork is approved.
          </Alert>
        ) : null}
        <Button variant="accent" fullWidth onClick={() => setCheckoutTried(true)}>
          Proceed to checkout
        </Button>
        {checkoutTried ? <PreLaunchNotice action="checkout" /> : null}
        <Button href={routes.products} variant="ghost" fullWidth>
          Continue shopping
        </Button>
      </aside>
    </div>
  );
}
