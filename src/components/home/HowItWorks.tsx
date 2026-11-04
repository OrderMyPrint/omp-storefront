import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { routes } from "@/config/site";
import styles from "./HowItWorks.module.css";

const steps = [
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
  {
    title: "Dispatch & tracking",
    detail: "Track each stage in your account, with courier details when shipped.",
  },
];

/** Figma SF-HOME-01 · How it works. */
export function HowItWorks() {
  return (
    <section className="container" aria-labelledby="journey-title">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <SectionHeading id="journey-title" overline="Your order journey" title="From your file to your doorstep" />
          <ol className={styles.steps}>
            {steps.map((step, index) => (
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
          <Button href={routes.products} variant="primary">
            Start configuring
          </Button>
        </div>
        <div className={styles.photo}>
          <Image
            src="/images/process.png"
            alt="A press operator checking a printed sheet against the approved proof"
            fill
            sizes="(max-width: 1199px) 100vw, 560px"
          />
        </div>
      </div>
    </section>
  );
}
