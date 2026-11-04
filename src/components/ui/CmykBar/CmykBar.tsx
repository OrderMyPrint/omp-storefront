import styles from "./CmykBar.module.css";

/** Four-colour process bar — the brand motif taken from the OMP logo. */
export function CmykBar() {
  return (
    <div className={styles.bar} aria-hidden="true">
      <span className={styles.c} />
      <span className={styles.m} />
      <span className={styles.y} />
      <span className={styles.k} />
    </div>
  );
}
