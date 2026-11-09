import Image from "next/image";
import Link from "next/link";
import { cx } from "@/lib/cx";
import styles from "./Logo.module.css";

type Props = { size?: "header" | "mobile" | "footer"; className?: string };

/**
 * Working-brand logo: the supplied raster with its paper background made transparent
 * (docs/brand/derived in OrderMyPrint/website). Never recolour or redraw it; the navy
 * wordmark needs a light background. Replace the file when the vector master arrives.
 */
export function Logo({ size = "header", className }: Props) {
  return (
    <Link href="/" className={cx(styles.logo, styles[size], className)} aria-label="Order My Print — home">
      <Image src="/images/logo-compact.png" alt="Order My Print" width={770} height={391} priority />
    </Link>
  );
}
