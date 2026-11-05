"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { TextField } from "@/components/ui/Field/TextField";
import { PreLaunchNotice } from "@/components/ui/PreLaunchNotice/PreLaunchNotice";
import { routes } from "@/config/site";
import { digitsOnly, isIndianMobile } from "@/lib/validation";
import styles from "./forms.module.css";

/** SF-AUTH-01 · Enter mobile number (OTP sign-in, no passwords — X-09). */
export function SignInForm() {
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className={styles.card}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (!isIndianMobile(mobile)) {
          setError("Enter a 10-digit Indian mobile number, e.g. 98765 43210.");
          setSubmitted(false);
          return;
        }
        setError(undefined);
        setSubmitted(true);
      }}
    >
      <h2 className="t-h3">Sign in or create an account</h2>
      <p className="t-body-m">
        We&apos;ll send a one-time password (OTP) to your mobile. There&apos;s no password to remember.
      </p>
      <TextField
        label="Mobile number"
        prefix="+91"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder="98765 43210"
        value={mobile}
        error={error}
        onChange={(event) => setMobile(digitsOnly(event.target.value, 10))}
      />
      <Button type="submit" variant="primary" fullWidth>
        Send OTP
      </Button>
      {submitted ? <PreLaunchNotice action="sign-in" /> : null}
      <p className={`t-body-xs ${styles.legal}`}>
        By continuing you agree to our <a href={routes.policy("terms")}>terms of use</a> and{" "}
        <a href={routes.policy("privacy")}>privacy policy</a>.
      </p>
    </form>
  );
}
