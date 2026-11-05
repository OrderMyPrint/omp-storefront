import type { Metadata } from "next";
import { FaqBrowser } from "@/components/help/FaqBrowser";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand/CtaBand";
import { routes, site } from "@/config/site";
import styles from "./help.module.css";

export const metadata: Metadata = {
  title: "Help centre · FAQ",
  description: "Answers about ordering, pricing, artwork files, delivery, payments, GST invoices and bulk quotations.",
};

/** SF-HELP-01 · FAQ. */
export default function HelpPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Help centre" }]} />
      <div className={`container ${styles.page}`}>
        <PageIntro
          overline="Help centre"
          title="Frequently asked questions"
          lead="Answers about ordering, artwork, delivery, payments and bulk quotations."
        />
        <FaqBrowser />
        <CtaBand
          title="Still need help?"
          detail={`Our team replies ${site.hours.replace("Mon–Sat", "Monday to Saturday")}.`}
          cta="Contact us"
          href={routes.contact}
        />
      </div>
    </>
  );
}
