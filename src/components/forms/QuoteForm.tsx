"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Select } from "@/components/ui/Field/Select";
import { TextArea, TextField } from "@/components/ui/Field/TextField";
import { PreLaunchNotice } from "@/components/ui/PreLaunchNotice/PreLaunchNotice";
import { digitsOnly, isEmail, isIndianMobile } from "@/lib/validation";
import styles from "./forms.module.css";

type Item = { key: number; product: string; quantity: string; notes: string };
type Errors = Record<string, string | undefined>;

/** SF-QUO-01 · Bulk quote request (multi-item). Products come from the live catalogue. */
export function QuoteForm({
  products,
  initialProduct,
}: {
  products: { slug: string; name: string }[];
  initialProduct?: string;
}) {
  const productOptions = [
    ...products.map((product) => ({ value: product.slug, label: product.name })),
    { value: "other", label: "Something else" },
  ];
  const first = products[0]?.slug ?? "other";
  const start = products.some((product) => product.slug === initialProduct) ? initialProduct! : first;
  const [items, setItems] = useState<Item[]>([{ key: 1, product: start, quantity: "", notes: "" }]);
  const [contact, setContact] = useState({
    company: "",
    name: "",
    mobile: "",
    email: "",
    gstin: "",
    needBy: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const setItem = (key: number, patch: Partial<Item>) =>
    setItems((current) => current.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  const setField = (key: keyof typeof contact, value: string) =>
    setContact((current) => ({ ...current, [key]: value }));

  return (
    <form
      className={styles.card}
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        const next: Errors = {
          name: contact.name.trim().length >= 2 ? undefined : "Enter your name.",
          mobile: isIndianMobile(contact.mobile) ? undefined : "Enter a 10-digit Indian mobile number.",
          email: isEmail(contact.email) ? undefined : "Enter an email address so we can send the quotation.",
          gstin:
            !contact.gstin || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(contact.gstin)
              ? undefined
              : "A GSTIN has 15 characters, e.g. 24ABCDE1234F1Z5.",
        };
        items.forEach((item) => {
          next[`qty-${item.key}`] = Number(item.quantity) > 0 ? undefined : "Enter a quantity.";
        });
        setErrors(next);
        setSubmitted(Object.values(next).every((value) => !value));
      }}
    >
      <h2 className="t-h4">What do you need?</h2>
      {items.map((item, index) => (
        <div key={item.key} className={styles.item}>
          <Select
            label={`Item ${index + 1}`}
            options={productOptions}
            value={item.product}
            onChange={(event) => setItem(item.key, { product: event.target.value })}
          />
          <TextField
            label="Quantity"
            inputMode="numeric"
            value={item.quantity}
            error={errors[`qty-${item.key}`]}
            onChange={(event) => setItem(item.key, { quantity: digitsOnly(event.target.value, 6) })}
          />
          <TextField
            label="Size, paper, finish…"
            optional
            value={item.notes}
            maxLength={200}
            onChange={(event) => setItem(item.key, { notes: event.target.value })}
          />
          <button
            type="button"
            className={styles.remove}
            disabled={items.length === 1}
            onClick={() => setItems((current) => current.filter((entry) => entry.key !== item.key))}
            aria-label={`Remove item ${index + 1}`}
          >
            <Trash2 size={20} aria-hidden="true" />
          </button>
        </div>
      ))}
      <Button
        variant="ghost"
        icon={Plus}
        className={styles.addItem}
        disabled={items.length >= 10}
        onClick={() =>
          setItems((current) => [...current, { key: Date.now(), product: first, quantity: "", notes: "" }])
        }
      >
        Add another product
      </Button>

      <h2 className="t-h4">Your details</h2>
      <div className={styles.row}>
        <TextField
          label="Company"
          optional
          autoComplete="organization"
          value={contact.company}
          onChange={(e) => setField("company", e.target.value)}
        />
        <TextField
          label="Your name"
          autoComplete="name"
          value={contact.name}
          error={errors.name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="Mobile number"
          prefix="+91"
          inputMode="numeric"
          autoComplete="tel-national"
          value={contact.mobile}
          error={errors.mobile}
          onChange={(e) => setField("mobile", digitsOnly(e.target.value, 10))}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          value={contact.email}
          error={errors.email}
          onChange={(e) => setField("email", e.target.value)}
        />
      </div>
      <div className={styles.row}>
        <TextField
          label="GSTIN"
          optional
          value={contact.gstin}
          error={errors.gstin}
          onChange={(e) =>
            setField(
              "gstin",
              e.target.value
                .toUpperCase()
                .replace(/[^0-9A-Z]/g, "")
                .slice(0, 15),
            )
          }
        />
        <TextField
          label="Needed by"
          optional
          type="date"
          value={contact.needBy}
          onChange={(e) => setField("needBy", e.target.value)}
        />
      </div>
      <TextArea
        label="Anything else we should know?"
        optional
        maxLength={2000}
        value={contact.notes}
        onChange={(e) => setField("notes", e.target.value)}
        hint="Delivery city, branding details, split deliveries — you can share artwork once we reply."
      />
      <Button type="submit" variant="primary">
        Request quotation
      </Button>
      {submitted ? <PreLaunchNotice action="quotation requests" /> : null}
    </form>
  );
}
