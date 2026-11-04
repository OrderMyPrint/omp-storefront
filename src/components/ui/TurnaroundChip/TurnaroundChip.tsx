import { Clock } from "lucide-react";
import styles from "./TurnaroundChip.module.css";

/** Figma "Turnaround Chip": production time before dispatch. */
export function TurnaroundChip({ days }: { days: string }) {
  return (
    <p className={`t-body-xs ${styles.chip}`}>
      <Clock size={16} aria-hidden="true" />
      Ready to ship in {days} working days
    </p>
  );
}
