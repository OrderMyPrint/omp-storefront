import type { ReactNode } from "react";
import type { ContentBlock } from "@/lib/content";

/**
 * Data attributes for a page section's visual-editor presets and per-device visibility.
 * The CSS for them lives in globals.css ("Visual editor presets") and only uses brand tokens.
 */
export function sectionAttrs(block: ContentBlock) {
  const s = block.style ?? {};
  const d = block.devices;
  return {
    "data-section-id": block.id,
    "data-bg": s.background,
    "data-spacing": s.spacing && s.spacing !== "standard" ? s.spacing : undefined,
    "data-width": s.width === "full" ? "full" : undefined,
    "data-align": s.align === "center" ? "center" : undefined,
    "data-image-side": s.imageSide === "start" ? "start" : undefined,
    "data-hide-desktop": d && !d.desktop ? "" : undefined,
    "data-hide-tablet": d && !d.tablet ? "" : undefined,
    "data-hide-mobile": d && !d.mobile ? "" : undefined,
  };
}

/** Wraps one page section so its presets and device visibility apply. */
export function Section({ block, children }: { block: ContentBlock; children: ReactNode }) {
  return (
    <div className="omp-section" {...sectionAttrs(block)}>
      {children}
    </div>
  );
}
