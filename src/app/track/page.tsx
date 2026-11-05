import type { Metadata } from "next";
import { TrackForm } from "@/components/forms/TrackForm";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import styles from "../help/help.module.css";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Look up your order with its order number and mobile number.",
};

const stages = [
  { title: "Artwork review", detail: "Pre-press checks your files" },
  { title: "Printing", detail: "Your order is in production" },
  { title: "Quality check", detail: "Checked against a QC list" },
  { title: "Dispatched", detail: "Courier details shared" },
  { title: "Delivered", detail: "Signed for at your address" },
];

/** SF-TRK-01 · Track order (public lookup). */
export default function TrackPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track order" }]} />
      <div className={`container ${styles.page} ${styles.narrow}`}>
        <PageIntro
          overline="Track order"
          title="Where’s my order?"
          lead="Enter your order number and the mobile number you ordered with. Signed-in customers see every order in their account."
        />
        <TrackForm />
        <section aria-labelledby="stages-title" className={styles.prose}>
          <h2 id="stages-title" className="t-h4">
            The stages you&apos;ll see
          </h2>
          <ol className={styles.cards}>
            {stages.map((stage, index) => (
              <li key={stage.title} className={styles.card}>
                <span className={styles.iconCircle}>{index + 1}</span>
                <h3 className="t-h5">{stage.title}</h3>
                <p className="t-body-s">{stage.detail}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  );
}
