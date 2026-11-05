import type { Metadata } from "next";
import { FaqBrowser } from "@/components/help/FaqBrowser";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { CtaBand } from "@/components/ui/CtaBand/CtaBand";
import { routes, site } from "@/config/site";
import type { FaqGroup } from "@/data/help";
import { blockOf, getFaq, getPage } from "@/lib/content";
import styles from "./help.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("/help");
  return {
    title: page?.seo.title ?? "Help centre · FAQ",
    description:
      page?.seo.description ??
      "Answers about ordering, pricing, artwork files, delivery, payments, GST invoices and bulk quotations.",
  };
}

/** SF-HELP-01 · FAQ. Questions come from the admin FAQ; page text from Website content › Help centre. */
export default async function HelpPage() {
  const [page, faq] = await Promise.all([getPage("/help"), getFaq()]);
  const groups: FaqGroup[] | undefined = faq?.length
    ? faq.map((t) => ({ id: t.key, title: t.title, items: t.items.map((i) => ({ q: i.question, a: i.answer })) }))
    : undefined;
  const cta = blockOf(page, "ctaBand");
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Help centre" }]} />
      <div className={`container ${styles.page}`}>
        <PageIntro
          overline={page?.overline ?? "Help centre"}
          title={page?.title ?? "Frequently asked questions"}
          lead={page?.lead ?? "Answers about ordering, artwork, delivery, payments and bulk quotations."}
        />
        <FaqBrowser groups={groups} />
        {cta ? (
          cta.primary ? (
            <CtaBand title={cta.heading} detail={cta.body ?? ""} cta={cta.primary.label} href={cta.primary.href} />
          ) : null
        ) : (
          <CtaBand
            title="Still need help?"
            detail={`Our team replies ${site.hours.replace("Mon–Sat", "Monday to Saturday")}.`}
            cta="Contact us"
            href={routes.contact}
          />
        )}
      </div>
    </>
  );
}
