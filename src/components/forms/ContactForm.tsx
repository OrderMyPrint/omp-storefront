"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Select } from "@/components/ui/Field/Select";
import { TextArea, TextField } from "@/components/ui/Field/TextField";
import { PreLaunchNotice } from "@/components/ui/PreLaunchNotice/PreLaunchNotice";
import { digitsOnly, isEmail, isIndianMobile } from "@/lib/validation";
import styles from "./forms.module.css";

const topics = [
  { value: "order", label: "An existing order" },
  { value: "artwork", label: "Artwork & files" },
  { value: "pricing", label: "Pricing & products" },
  { value: "bulk", label: "Bulk & corporate" },
  { value: "other", label: "Something else" },
];

type Errors = Partial<Record<"name" | "mobile" | "email" | "message", string>>;

/** SF-HELP-02 · Contact form. */
export function ContactForm() {
  const [values, setValues] = useState({ name: "", mobile: "", email: "", topic: "order", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const set = (key: keyof typeof values, value: string) => setValues((current) => ({ ...current, [key]: value }));

  return (
    <form
      className={styles.card}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const next: Errors = {
          name: values.name.trim().length >= 2 ? undefined : "Enter your name.",
          mobile: isIndianMobile(values.mobile) ? undefined : "Enter a 10-digit Indian mobile number.",
          email: !values.email || isEmail(values.email) ? undefined : "Enter a valid email address, or leave it empty.",
          message: values.message.trim().length >= 10 ? undefined : "Tell us a little more (at least 10 characters).",
        };
        setErrors(next);
        setSubmitted(Object.values(next).every((value) => !value));
      }}
    >
      <h2 className="t-h4">Send us a message</h2>
      <div className={styles.row}>
        <TextField
          label="Your name"
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={(e) => set("name", e.target.value)}
        />
        <TextField
          label="Mobile number"
          prefix="+91"
          inputMode="numeric"
          autoComplete="tel-national"
          value={values.mobile}
          error={errors.mobile}
          onChange={(e) => set("mobile", digitsOnly(e.target.value, 10))}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="Email"
          optional
          type="email"
          autoComplete="email"
          value={values.email}
          error={errors.email}
          onChange={(e) => set("email", e.target.value)}
        />
        <Select label="Topic" options={topics} value={values.topic} onChange={(e) => set("topic", e.target.value)} />
      </div>
      <TextArea
        label="Message"
        maxLength={2000}
        value={values.message}
        error={errors.message}
        hint="Include your order number if your message is about an order."
        onChange={(e) => set("message", e.target.value)}
      />
      <Button type="submit" variant="primary">
        Send message
      </Button>
      {submitted ? <PreLaunchNotice action="messaging" /> : null}
    </form>
  );
}
