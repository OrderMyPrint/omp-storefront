import { NavAnchor } from "@/components/layout/Header/NavAnchor";
import { Logo } from "@/components/ui/Logo/Logo";
import type { SiteChrome } from "@/lib/chrome";
import styles from "./Footer.module.css";

/** Figma "Footer / Desktop | Mobile". Columns come from the admin (Navigation › Footer). */
export function Footer({ chrome }: { chrome: SiteChrome }) {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      <div className={styles.spectrum} aria-hidden="true" />
      <div className={`container ${styles.columns}`}>
        <div className={styles.brand}>
          <div className={styles.logoPlate}>
            <Logo size="footer" />
          </div>
          <p className="t-body-s">{chrome.tagline}</p>
          <a href={chrome.contact.phoneHref} className={`t-label-m ${styles.phone}`}>
            {chrome.contact.phone}
          </a>
          <p className={`t-body-xs ${styles.hours}`}>{chrome.contact.hours}</p>
        </div>
        {chrome.footer.map((group) => (
          <nav key={group.title} aria-label={group.title} className={styles.group}>
            <p className={`t-label-m ${styles.groupTitle}`}>{group.title}</p>
            <ul className={styles.links}>
              {group.links.map((link) => (
                <li key={link.href + link.label}>
                  <NavAnchor link={link} className="t-body-s" />
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
