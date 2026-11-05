import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { routes } from "@/config/site";
import type { StepsBlock } from "@/lib/content";
import styles from "./HowItWorks.module.css";

const fallback: StepsBlock = {
  id: "journey",
  type: "steps",
  overline: "Your order journey",
  heading: "From your file to your doorstep",
  steps: [
    {
      title: "Configure & upload",
      detail: "Choose options, see the price, upload print-ready artwork now or after checkout.",
    },
    {
      title: "Pre-press review",
      detail: "Our team reviews every file. If anything needs fixing, we ask before printing.",
    },
    {
      title: "Production & quality check",
      detail: "Printed after payment and artwork approval, then checked against a QC list.",
    },
    { title: "Dispatch & tracking", detail: "Track each stage in your account, with courier details when shipped." },
  ],
  cta: { label: "Start configuring", href: routes.products, external: false },
  image: {
    url: "/images/process.png",
    alt: "A press operator checking a printed sheet against the approved proof",
    width: 1152,
    height: 928,
  },
};

/** Figma SF-HOME-01 · How it works. */
export function HowItWorks({ block = fallback }: { block?: StepsBlock }) {
  return (
    <section className="container" aria-labelledby="journey-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <SectionHeading id="journey-title" overline={block.overline ?? ""} title={block.heading} />
          <ol className={styles.steps}>
            {block.steps.map((step, index) => (
              <li key={step.title} className={styles.step}>
                <span className={`t-h3 ${styles.number}`} aria-hidden="true">
                  {index + 1}
                </span>
                <div className={styles.stepText}>
                  <h3 className="t-h5">{step.title}</h3>
                  <p className="t-body-m">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
          {block.cta ? (
            <Button href={block.cta.href} variant="primary">
              {block.cta.label}
            </Button>
          ) : null}
        </div>
        {block.image ? (
          <div className={styles.photo}>
            <Image src={block.image.url} alt={block.image.alt} fill sizes="(max-width: 1199px) 100vw, 560px" />
          </div>
        ) : null}
      </div>
    </section>
  );
}
