import type { Metadata } from "next";
import Image from "next/image";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { CheckList } from "@/components/ui/CheckList/CheckList";
import { CtaBand } from "@/components/ui/CtaBand/CtaBand";
import { routes } from "@/config/site";
import styles from "../help/help.module.css";

export const metadata: Metadata = {
  title: "About us",
  description:
    "Order My Print — premium and professional printing for individuals, businesses and corporate teams across India.",
};

export default function AboutPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About us" }]} />
      <div className={`container ${styles.page}`}>
        <section className={styles.hero}>
          <PageIntro
            overline="About us"
            title="Premium & professional printing"
            lead="Order My Print helps individuals, businesses and corporate teams across India order print online — with a clear price before you pay and a person checking every file."
          />
          <div className={styles.heroImage}>
            <Image
              src="/images/process.png"
              alt="A press operator checking a printed sheet against the approved proof"
              fill
              priority
              sizes="(max-width: 1199px) 100vw, 600px"
            />
          </div>
        </section>
        <div className={styles.split}>
          <div className={styles.prose}>
            <h2 className="t-h3">How we work</h2>
            <p className="t-body-l">
              You configure your product online and see the price, quantity tiers and GST straight away. Our pre-press
              team reviews every file before printing, each order is checked against a quality list, and you can follow
              every stage until it reaches your door.
            </p>
          </div>
          <CheckList
            items={[
              "Transparent pricing with GST shown before checkout",
              "Every file reviewed by a person",
              "Order tracking from artwork to delivery",
              "GST invoices for every order",
              "Bulk and corporate quotations",
            ]}
          />
        </div>
        <CtaBand
          title="Ready to print?"
          detail="Browse our products and configure yours in minutes."
          cta="Shop products"
          href={routes.products}
        />
      </div>
    </>
  );
}
