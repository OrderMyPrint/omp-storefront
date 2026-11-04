import { ChevronDown } from "lucide-react";
import { useId, type ComponentPropsWithoutRef } from "react";
import styles from "./Field.module.css";

type Option = { value: string; label: string };
type Props = { label: string; options: Option[] } & Omit<ComponentPropsWithoutRef<"select">, "children">;

/** Figma "Select" — a styled native select (keyboard and screen-reader friendly). */
export function Select({ label, options, id, ...selectProps }: Props) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <div className={styles.field}>
      <label htmlFor={selectId} className={`t-label-m ${styles.label}`}>
        {label}
      </label>
      <div className={styles.selectWrap}>
        <select id={selectId} className={`t-body-m ${styles.select}`} {...selectProps}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={20} aria-hidden="true" className={styles.chevron} />
      </div>
    </div>
  );
}
