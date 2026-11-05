"use client";

import { RotateCcw } from "lucide-react";
import { ErrorState } from "@/components/layout/ErrorState/ErrorState";
import { Button } from "@/components/ui/Button/Button";
import { routes } from "@/config/site";

/** SF-ERR-01 · 500 variant. */
export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <ErrorState
      code="500"
      title="Something went wrong on our side"
      lead="Your cart is saved. Please try again in a moment."
    >
      <Button icon={RotateCcw} onClick={() => reset()}>
        Try again
      </Button>
      <Button href={routes.contact} variant="secondary">
        Contact support
      </Button>
    </ErrorState>
  );
}
