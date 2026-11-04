import Link from "next/link";
import { Logo } from "@/components/ui/Logo/Logo";
import { footerNav, site } from "@/config/site";
import styles from "./Footer.module.css";

/** Figma "Footer / Desktop | Mobile". */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.spectrum} aria-hidden="true" />
      <div className={`container ${styles.columns}`}>
        <div className={styles.brand}>
          <div className={styles.logoPlate}>
            <Logo size="footer" />
          </div>
          <p className="t-body-s">
            Premium &amp; professional printing for individuals, businesses and corporate teams across India.
          </p>
          <a href={site.phone.href} className={`t-label-m ${styles.phone}`}>
            {site.phone.display}
          </a>
          <p className={`t-body-xs ${styles.hours}`}>{site.hours}</p>
        </div>
        {footerNav.map((group) => (
          <nav key={group.title} aria-label={group.title} className={styles.group}>
            <p className={`t-label-m ${styles.groupTitle}`}>{group.title}</p>
            <ul className={styles.links}>
              {group.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link href={link.href} className="t-body-s">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className={styles.legal}>
        <div className={`container ${styles.legalInner}`}>
          <p className="t-body-xs">© {year} Order My Print. All rights reserved.</p>
          <p className="t-body-xs">Secure payments: UPI, cards, net banking and wallets</p>
        </div>
      </div>
    </footer>
  );
}
