import Link from "next/link";
import { ChevronDown, LayoutGrid, MessageSquare, Phone, Truck, User } from "lucide-react";
import { Logo } from "@/components/ui/Logo/Logo";
import { routes } from "@/config/site";
import type { SiteChrome } from "@/lib/chrome";
import { CartLink } from "./CartLink";
import { MobileMenu } from "./MobileMenu";
import { NavAnchor } from "./NavAnchor";
import { SearchForm } from "./SearchForm";
import styles from "./Header.module.css";

/** Figma "Header / Desktop | Tablet | Mobile" — one responsive header. Links come from the admin (Navigation). */
export function Header({ chrome }: { chrome: SiteChrome }) {
  return (
    <header className={styles.header}>
      {chrome.announcement ? (
        <div className={styles.announcement} role="region" aria-label="Announcement">
          <div className="container t-label-s">
            {chrome.announcement.href ? (
              <a href={chrome.announcement.href} rel={chrome.announcement.external ? "noopener noreferrer" : undefined}>
                {chrome.announcement.message}
              </a>
            ) : (
              chrome.announcement.message
            )}
          </div>
        </div>
      ) : null}
      <div className={styles.utilityBar}>
        <div className={`container ${styles.utilityInner}`}>
          <a href={chrome.contact.phoneHref} className={`t-body-xs ${styles.phone}`}>
            <Phone size={16} aria-hidden="true" />
            Help: {chrome.contact.phone}
          </a>
          <nav aria-label="Help links">
            <ul className={styles.utilityLinks}>
              {chrome.utility.map((link) => (
                <li key={link.href + link.label}>
                  <NavAnchor link={link} className="t-label-s" />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className={`container ${styles.mainRow}`}>
        <MobileMenu chrome={chrome} />
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
          {chrome.categories.map((link) => (
            <NavAnchor key={link.href} link={link} className={`t-label-m ${styles.categoryLink}`} />
          ))}
          {chrome.quote ? (
            <Link href={chrome.quote.href} className={`t-label-m ${styles.quoteLink}`}>
              <MessageSquare size={20} aria-hidden="true" />
              {chrome.quote.label}
            </Link>
          ) : null}
        </div>
      </nav>
      <div className={styles.spectrumRule} aria-hidden="true" />
    </header>
  );
}
