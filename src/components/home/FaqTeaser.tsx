import { Button } from "@/components/ui/Button/Button";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { routes } from "@/config/site";
import styles from "./FaqTeaser.module.css";

const faqs = [
  {
    q: "How is my price calculated?",
    a: "Your price comes from the product, quantity and options you choose — paper, sides, finish and setup — plus GST. The configurator shows the full breakdown, and our server confirms the final price at checkout.",
  },
  {
    q: "Can I upload CorelDRAW (CDR) files?",
    a: "Yes. We accept PDF, PNG, JPEG, SVG and CDR. CDR files are reviewed manually by our pre-press team in CorelDRAW; attaching a PDF copy helps us check your design faster.",
  },
  {
    q: "When does printing start?",
    a: "Printing starts once your payment is confirmed and our pre-press team has approved your artwork.",
  },
  {
    q: "Do you provide GST invoices?",
    a: "Yes. Every order comes with a GST invoice. Add your GSTIN at checkout to claim input tax credit.",
  },
];

/** Figma SF-HOME-01 · FAQ teaser (native details/summary accordion). */
export function FaqTeaser() {
  return (
    <section className={styles.band} aria-labelledby="faq-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <SectionHeading id="faq-title" overline="Help" title="Questions, answered" />
          <Button href={routes.help} variant="secondary">
            Visit the help centre
          </Button>
        </div>
        <div className={styles.list}>
          {faqs.map((item) => (
            <details key={item.q} className={styles.item}>
              <summary className={`t-label-l ${styles.question}`}>{item.q}</summary>
              <p className={`t-body-m ${styles.answer}`}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
