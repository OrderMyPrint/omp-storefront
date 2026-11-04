"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Menu, X } from "lucide-react";
import { categories } from "@/data/catalogue";
import { routes, site, utilityNav } from "@/config/site";
import styles from "./Header.module.css";

/** Figma "SF-NAV-01-M · Menu drawer" — shown below 768 px. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panelId = useId();

  // Close on navigation and on Escape; lock page scroll while open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
      </button>

      {open ? (
        <div className={styles.drawerScrim} onClick={() => setOpen(false)} aria-hidden="true" />
      ) : null}
      <nav id={panelId} className={styles.drawer} data-open={open} aria-label="Menu" hidden={!open}>
        <p className={`t-overline ${styles.drawerHeading}`}>Shop</p>
        <ul className={styles.drawerList}>
          <li>
            <Link href={routes.products} className="t-label-l">
              All products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <Link href={routes.category(category.slug)} className="t-label-l">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className={`t-overline ${styles.drawerHeading}`}>Account & help</p>
        <ul className={styles.drawerList}>
          <li>
            <Link href={routes.signIn} className="t-label-l">
              Sign in
            </Link>
          </li>
          {utilityNav.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="t-label-l">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <a href={site.phone.href} className={`t-label-m ${styles.drawerPhone}`}>
          Call {site.phone.display} · {site.hours}
        </a>
      </nav>
    </>
  );
}
