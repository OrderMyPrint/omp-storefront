import { Button } from "@/components/ui/Button/Button";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { routes } from "@/config/site";
import { faqGroups } from "@/data/help";
import type { FaqListBlock } from "@/lib/content";
import styles from "./FaqTeaser.module.css";

const homepageQuestions = [
  "How is my price calculated?",
  "Can I upload CorelDRAW (CDR) files?",
  "When does printing start?",
  "Do you provide GST invoices?",
];

const fallback: FaqListBlock = {
  id: "faq",
  type: "faqList",
  overline: "Help",
  heading: "Questions, answered",
  items: faqGroups
    .flatMap((g) => g.items)
    .filter((i) => homepageQuestions.includes(i.q))
    .map((i) => ({ id: i.q, question: i.q, answer: i.a })),
  cta: { label: "Visit the help centre", href: routes.help, external: false },
};

/** Figma SF-HOME-01 · FAQ teaser — questions marked “Show on homepage” in the admin FAQ. */
export function FaqTeaser({ block = fallback }: { block?: FaqListBlock }) {
  return (
    <section className={styles.band} aria-labelledby={`${block.id}-title`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <SectionHeading id={`${block.id}-title`} overline={block.overline ?? ""} title={block.heading} />
          {block.cta ? (
            <Button href={block.cta.href} variant="secondary">
              {block.cta.label}
            </Button>
          ) : null}
        </div>
        <div className={styles.list}>
          {block.items.map((item) => (
            <details key={item.id} className={styles.item}>
              <summary className={`t-label-l ${styles.question}`}>{item.question}</summary>
              <p className={`t-body-m ${styles.answer}`}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
