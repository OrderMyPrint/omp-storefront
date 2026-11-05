"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { TextField } from "@/components/ui/Field/TextField";
import { PreLaunchNotice } from "@/components/ui/PreLaunchNotice/PreLaunchNotice";
import { digitsOnly, isIndianMobile } from "@/lib/validation";
import styles from "./forms.module.css";

/** SF-TRK-01 · Track order (public lookup by order number + mobile). */
export function TrackForm() {
  const [order, setOrder] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState<{ order?: string; mobile?: string }>({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className={styles.card}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const next = {
          order: order.trim().length >= 4 ? undefined : "Enter the order number from your confirmation message.",
          mobile: isIndianMobile(mobile) ? undefined : "Enter the 10-digit mobile number used for the order.",
        };
        setErrors(next);
        setSubmitted(!next.order && !next.mobile);
      }}
    >
      <h2 className="t-h4">Find your order</h2>
      <div className={styles.row}>
        <TextField
          label="Order number"
          placeholder="e.g. OMP-2026-001190"
          autoComplete="off"
          value={order}
          error={errors.order}
          onChange={(event) => setOrder(event.target.value.toUpperCase().slice(0, 20))}
        />
        <TextField
          label="Mobile number"
          prefix="+91"
          inputMode="numeric"
          autoComplete="tel-national"
          value={mobile}
          error={errors.mobile}
          onChange={(event) => setMobile(digitsOnly(event.target.value, 10))}
        />
      </div>
      <Button type="submit" variant="primary">
        Track order
      </Button>
      {submitted ? <PreLaunchNotice action="order tracking" /> : null}
      <p className="t-body-xs">
        For your privacy, full order details are shown only after we verify your mobile number with an OTP.
      </p>
    </form>
  );
}
