import type { Metadata } from "next";
import { EditorCanvas } from "./EditorCanvas";

export const metadata: Metadata = {
  title: "Visual editor preview",
  robots: { index: false, follow: false },
};

/**
 * Canvas for the admin's visual page editor (AD-WEB-07…11). It is loaded in an iframe by
 * OrderMyPrint/omp-admin and renders the draft it receives by postMessage with the real
 * storefront sections. It never fetches drafts itself, so it shows nothing on its own.
 */
export default function EditorPreviewPage() {
  return <EditorCanvas />;
}
