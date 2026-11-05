import { useId, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Field.module.css";

type Common = { label: string; hint?: ReactNode; error?: string; prefix?: string; optional?: boolean };

/** Figma "Text Field" with label, optional hint, prefix (e.g. +91) and error. */
export function TextField({
  label,
  hint,
  error,
  prefix,
  optional,
  id,
  className,
  ...inputProps
}: Common & ComponentPropsWithoutRef<"input">) {
  const generated = useId();
  const inputId = id ?? generated;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={inputId} className={`t-label-m ${styles.label}`}>
        {label}
        {optional ? <span className={styles.optional}> (optional)</span> : null}
      </label>
      <div className={cx(styles.inputWrap, error && styles.invalid)}>
        {prefix ? <span className={`t-body-m ${styles.prefix}`}>{prefix}</span> : null}
        <input
          id={inputId}
          className={`t-body-m ${styles.input}`}
          aria-invalid={error ? true : undefined}
          aria-describedby={cx(Boolean(hint) && hintId, Boolean(error) && errorId) || undefined}
          {...inputProps}
        />
      </div>
      {hint ? (
        <p id={hintId} className={`t-body-xs ${styles.hint}`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={`t-body-xs ${styles.error}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({
  label,
  hint,
  error,
  optional,
  id,
  className,
  ...areaProps
}: Omit<Common, "prefix"> & ComponentPropsWithoutRef<"textarea">) {
  const generated = useId();
  const areaId = id ?? generated;
  const errorId = `${areaId}-error`;
  const hintId = `${areaId}-hint`;
  return (
    <div className={cx(styles.field, className)}>
      <label htmlFor={areaId} className={`t-label-m ${styles.label}`}>
        {label}
        {optional ? <span className={styles.optional}> (optional)</span> : null}
      </label>
      <textarea
        id={areaId}
        className={cx(`t-body-m ${styles.textarea}`, error && styles.invalid)}
        aria-invalid={error ? true : undefined}
        aria-describedby={cx(Boolean(hint) && hintId, Boolean(error) && errorId) || undefined}
        {...areaProps}
      />
      {hint ? (
        <p id={hintId} className={`t-body-xs ${styles.hint}`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className={`t-body-xs ${styles.error}`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
