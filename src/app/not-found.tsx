import { ErrorState } from "@/components/layout/ErrorState/ErrorState";
import { Button } from "@/components/ui/Button/Button";
import { routes } from "@/config/site";

/** SF-ERR-01 · 404. */
export default function NotFound() {
  return (
    <ErrorState
      code="404"
      title="This page didn’t make it to print"
      lead="The link may be old or mistyped. Try searching, or start from our products."
    >
      <Button href={routes.products}>Browse products</Button>
      <Button href={routes.contact} variant="secondary">
        Contact support
      </Button>
    </ErrorState>
  );
}
