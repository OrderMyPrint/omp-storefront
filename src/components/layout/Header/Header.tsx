import Link from "next/link";
import { ChevronDown, LayoutGrid, MessageSquare, Phone, Truck, User } from "lucide-react";
import { CartLink } from "./CartLink";
import { Logo } from "@/components/ui/Logo/Logo";
import { categories } from "@/data/catalogue";
import { routes, site, utilityNav } from "@/config/site";
import { MobileMenu } from "./MobileMenu";
import { SearchForm } from "./SearchForm";
import styles from "./Header.module.css";

/** Figma "Header / Desktop | Tablet | Mobile" — one responsive header. */
export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.utilityBar}>
        <div className={`container ${styles.utilityInner}`}>
          <a href={site.phone.href} className={`t-body-xs ${styles.phone}`}>
            <Phone size={16} aria-hidden="true" />
            Help: {site.phone.display}
          </a>
          <nav aria-label="Help links">
            <ul className={styles.utilityLinks}>
              {utilityNav.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="t-label-s">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className={`container ${styles.mainRow}`}>
        <MobileMenu />
        <Logo size="header" className={styles.logo} />
        <SearchForm className={styles.search} />
        <div className={styles.actions}>
          <Link href={routes.track} className={`t-label-m ${styles.action} ${styles.hideMobile}`}>
            <Truck size={20} aria-hidden="true" />
            Track
          </Link>
          <Link href={routes.signIn} className={`t-label-m ${styles.action} ${styles.hideMobile}`}>
            <User size={20} aria-hidden="true" />
            Sign in
          </Link>
          <CartLink />
        </div>
      </div>

      <nav className={styles.categoryNav} aria-label="Product categories">
        <div className={`container ${styles.categoryInner}`}>
          <Link href={routes.products} className={`t-label-m ${styles.allProducts}`}>
            <LayoutGrid size={20} aria-hidden="true" />
            All products
            <ChevronDown size={16} aria-hidden="true" />
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={routes.category(category.slug)}
              className={`t-label-m ${styles.categoryLink}`}
            >
              {category.name}
            </Link>
          ))}
          <Link href={routes.quote} className={`t-label-m ${styles.quoteLink}`}>
            <MessageSquare size={20} aria-hidden="true" />
            Get a bulk quote
          </Link>
        </div>
      </nav>
      <div className={styles.spectrumRule} aria-hidden="true" />
    </header>
  );
}
