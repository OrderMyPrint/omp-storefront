import type { Metadata } from "next";
import Image from "next/image";
import { FileText, Grid2x2, ImageIcon, Layers, PenLine, Printer } from "lucide-react";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { Alert } from "@/components/ui/Alert/Alert";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import { artworkRules } from "@/data/help";
import { routes } from "@/config/site";
import styles from "../help.module.css";

export const metadata: Metadata = {
  title: "Artwork guidelines",
  description: "File formats, CorelDRAW (CDR) tips, resolution, bleed, colour and fonts — get your files print-ready.",
};

const icons = { file: FileText, layers: Layers, image: ImageIcon, grid: Grid2x2, printer: Printer, pen: PenLine };

/** SF-HELP-04 · Artwork guidelines. */
export default function ArtworkGuidelinesPage() {
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Help centre", href: routes.help },
          { label: "Artwork guidelines" },
        ]}
      />
      <div className={`container ${styles.page}`}>
        <section className={styles.hero}>
          <PageIntro
            overline="Artwork guidelines"
            title="Get your files print-ready"
            lead="Follow these basics and our pre-press team can approve your artwork faster."
          />
          <div className={styles.heroImage}>
            <Image
              src="/images/product-visiting-cards.png"
              alt=""
              fill
              priority
              sizes="(max-width: 1199px) 100vw, 600px"
            />
          </div>
        </section>

        <ul className={styles.cards}>
          {artworkRules.map((rule) => {
            const Icon = icons[rule.icon];
            return (
              <li key={rule.title} className={styles.card}>
                <span className={styles.iconCircle}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h2 className="t-h5">{rule.title}</h2>
                <p className="t-body-s">{rule.detail}</p>
              </li>
            );
          })}
        </ul>

        <Alert tone="warning" title="Basic checks are not a print-quality guarantee">
          Automatic checks catch file problems such as wrong type, corruption or low resolution. A person in pre-press
          reviews every file before printing.
        </Alert>
      </div>
    </>
  );
}
