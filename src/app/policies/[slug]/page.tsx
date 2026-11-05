import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Alert } from "@/components/ui/Alert/Alert";
import { getPolicy, policies } from "@/data/help";
import { routes, site } from "@/config/site";
import styles from "../../help/help.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const policy = getPolicy((await params).slug);
  return policy ? { title: policy.title } : {};
}

/**
 * SF-HELP-03 · Policy page template. Policy wording is a business and legal
 * decision (D-09), so every page says clearly that it is not final.
 */
export default async function PolicyPage({ params }: Params) {
  const policy = getPolicy((await params).slug);
  if (!policy) notFound();

  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Help centre", href: routes.help }, { label: policy.title }]}
      />
      <div className={`container ${styles.page}`}>
        <div className={styles.policy}>
          <nav className={styles.toc} aria-label="On this page">
            <p className="t-label-m">On this page</p>
            {policy.sections ? (
              policy.sections.map((section, index) => (
                <a key={section.heading} href={`#section-${index + 1}`} className="t-body-s">
                  {index + 1}. {section.heading}
                </a>
              ))
            ) : (
              <p className={`t-body-s ${styles.muted}`}>Sections appear here once the policy is published.</p>
            )}
          </nav>
          <article className={styles.prose}>
            <PageIntro overline="Policy" title={policy.title} />
            <Alert tone="warning" title={policy.sections ? "Draft — awaiting legal review" : "Being finalised"}>
              {policy.sections
                ? "This wording is a draft and may change before we start taking orders online."
                : "We are finalising this policy with our legal adviser and will publish it before we start taking orders online."}{" "}
              Questions? Call <a href={site.phone.href}>{site.phone.display}</a> ({site.hours}).
            </Alert>
            {policy.sections?.map((section, index) => (
              <section key={section.heading} aria-labelledby={`section-${index + 1}`} className={styles.prose}>
                <h2 id={`section-${index + 1}`} className="t-h4">
                  {index + 1}. {section.heading}
                </h2>
                <p className="t-body-l">{section.body}</p>
              </section>
            ))}
          </article>
        </div>
      </div>
    </>
  );
}
