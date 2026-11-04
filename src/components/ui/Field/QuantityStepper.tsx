import { Minus, Plus } from "lucide-react";
import { useId } from "react";
import { formatQuantity } from "@/lib/format";
import styles from "./Field.module.css";

type Props = {
  label: string;
  /** Allowed quantities in ascending order; the stepper moves between them. */
  steps: number[];
  value: number;
  onChange: (value: number) => void;
};

/** Figma "Quantity Stepper" — steps through the product's price tiers. */
export function QuantityStepper({ label, steps, value, onChange }: Props) {
  const labelId = useId();
  const index = Math.max(0, steps.indexOf(value));
  const atStart = index <= 0;
  const atEnd = index >= steps.length - 1;

  return (
    <div className={styles.field} role="group" aria-labelledby={labelId}>
      <span id={labelId} className={`t-label-m ${styles.label}`}>
        {label}
      </span>
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepButton}
          onClick={() => onChange(steps[index - 1])}
          disabled={atStart}
          aria-label="Decrease quantity"
        >
          <Minus size={20} aria-hidden="true" />
        </button>
        <output className={`t-label-l ${styles.stepValue}`} aria-live="polite">
          {formatQuantity(value)}
        </output>
        <button
          type="button"
          className={styles.stepButton}
          onClick={() => onChange(steps[index + 1])}
          disabled={atEnd}
          aria-label="Increase quantity"
        >
          <Plus size={20} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
