import { Search } from "lucide-react";
import { cx } from "@/lib/cx";
import styles from "./Header.module.css";

/** Site search. Submits to /search?q=… (results page arrives in a later stage). */
export function SearchForm({ className }: { className?: string }) {
  return (
    <form role="search" action="/search" className={cx(styles.searchForm, className)}>
      <label htmlFor="site-search" className="visually-hidden">
        Search products
      </label>
      <Search size={20} aria-hidden="true" className={styles.searchIcon} />
      <input
        id="site-search"
        name="q"
        type="search"
        placeholder="Search visiting cards, stickers, T-shirts…"
        className={`t-body-m ${styles.searchInput}`}
        autoComplete="off"
      />
    </form>
  );
}
