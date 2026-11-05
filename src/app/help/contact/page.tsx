import type { Metadata } from "next";
import { Clock, MessageSquare, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { routes, site } from "@/config/site";
import styles from "../help.module.css";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Call ${site.phone.display} (${site.hours}) or send us a message.`,
};

/** SF-HELP-02 · Contact. */
export default function ContactPage() {
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Help centre", href: routes.help }, { label: "Contact" }]}
      />
      <div className={`container ${styles.page}`}>
        <PageIntro
          overline="Help centre"
          title="Contact us"
          lead="Questions about an order, artwork or pricing? We're happy to help."
        />
        <div className={styles.split}>
          <ul className={styles.prose}>
            <li className={styles.card}>
              <span className={styles.iconCircle}>
                <Phone size={20} aria-hidden="true" />
              </span>
              <h2 className="t-h5">Call us</h2>
              <a href={site.phone.href} className="t-label-l">
                {site.phone.display}
              </a>
            </li>
            <li className={styles.card}>
              <span className={styles.iconCircle}>
                <Clock size={20} aria-hidden="true" />
              </span>
              <h2 className="t-h5">Opening hours</h2>
              <p className="t-body-m">{site.hours}</p>
            </li>
            <li className={styles.card}>
              <span className={styles.iconCircle}>
                <MessageSquare size={20} aria-hidden="true" />
              </span>
              <h2 className="t-h5">Ordering in bulk?</h2>
              <p className="t-body-m">
                Use our <a href={routes.quote}>quotation request</a> so the sales team has everything they need.
              </p>
            </li>
          </ul>
          <ContactForm />
        </div>
      </div>
    </>
  );
}
