import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { Alert } from "@/components/ui/Alert/Alert";
import { ContentBlocks, headingId } from "@/components/content/ContentBlocks";
import { getPolicy, policies } from "@/data/help";
import { getPage, type ContentPage } from "@/lib/content";
import { routes, site } from "@/config/site";
import styles from "../../help/help.module.css";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return policies.map((policy) => ({ slug: policy.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const slug = (await params).slug;
  const page = await getPage(`/policies/${slug}`);
  const policy = getPolicy(slug);
  return page
    ? { title: page.seo.title ?? page.title, description: page.seo.description }
    : policy
      ? { title: policy.title }
      : {};
}

/** Published from the admin (Website content › Pages): notice + rich text, with an "On this page" list. */
function PublishedPolicy({ page }: { page: ContentPage }) {
  const headings = page.blocks.flatMap((b) =>
    b.type === "richText"
      ? b.nodes.flatMap((n, i) => (n.type === "heading" ? [{ id: headingId(b.id, i), text: n.text }] : []))
      : [],
  );
  return (
    <>
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Help centre", href: routes.help }, { label: page.title }]}
      />
      <div className={`container ${styles.page}`}>
        <div className={styles.policy}>
          <nav className={styles.toc} aria-label="On this page">
            <p className="t-label-m">On this page</p>
            {headings.length ? (
              headings.map((h) => (
                <a key={h.id} href={`#${h.id}`} className="t-body-s">
                  {h.text}
                </a>
              ))
            ) : (
              <p className={`t-body-s ${styles.muted}`}>Sections appear here once the policy is published.</p>
            )}
          </nav>
          <article className={styles.prose}>
            <PageIntro overline={page.overline ?? "Policy"} title={page.title} lead={page.lead ?? undefined} />
            <ContentBlocks blocks={page.blocks} inline />
          </article>
        </div>
      </div>
    </>
  );
}

/**
 * SF-HELP-03 · Policy page template. Policy wording is a business and legal
 * decision (D-09), so every page says clearly that it is not final.
 */
export default async function PolicyPage({ params }: Params) {
  const slug = (await params).slug;
  const page = await getPage(`/policies/${slug}`);
  if (page) return <PublishedPolicy page={page} />;
  const policy = getPolicy(slug);
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
