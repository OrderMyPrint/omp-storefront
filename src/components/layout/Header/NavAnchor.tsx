import Link from "next/link";
import type { ChromeLink } from "@/lib/chrome";

/** Internal links use client navigation; external ones (admin-set https URLs) open safely. */
export function NavAnchor({ link, className }: { link: ChromeLink; className?: string }) {
  if (link.external || link.newTab)
    return (
      <a href={link.href} className={className} target={link.newTab ? "_blank" : undefined} rel="noopener noreferrer">
        {link.label}
      </a>
    );
  return (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}
