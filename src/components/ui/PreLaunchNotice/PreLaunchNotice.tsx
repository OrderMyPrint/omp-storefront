import { Alert } from "@/components/ui/Alert/Alert";
import { site } from "@/config/site";

/**
 * Shown when a form is filled in correctly but the service behind it is not
 * connected yet (the order and account API arrives in Phase 3). Nothing is
 * sent anywhere; the visitor is pointed to the phone line instead.
 */
export function PreLaunchNotice({ action }: { action: string }) {
  return (
    <Alert tone="info" title={`Online ${action} is not open yet`} live>
      We are finishing our online ordering system, so this form doesn&apos;t send anything yet. Call us on{" "}
      <a href={site.phone.href}>{site.phone.display}</a> ({site.hours}) and we&apos;ll help you right away.
    </Alert>
  );
}
