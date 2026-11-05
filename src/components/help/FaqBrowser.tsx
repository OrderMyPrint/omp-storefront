"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { faqGroups as builtInGroups, type FaqGroup } from "@/data/help";
import { cx } from "@/lib/cx";
import styles from "./FaqBrowser.module.css";

/** Figma SF-HELP-01 — topic navigation, question search and accordions. */
export function FaqBrowser({ groups: faqGroups = builtInGroups }: { groups?: FaqGroup[] }) {
  const [topic, setTopic] = useState(faqGroups[0]?.id ?? "");
  const [query, setQuery] = useState("");

  const searching = query.trim().length > 1;
  const groups = useMemo(() => {
    if (!searching) return faqGroups.filter((group) => group.id === topic);
    const needle = query.trim().toLowerCase();
    return faqGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => `${item.q} ${item.a}`.toLowerCase().includes(needle)),
      }))
      .filter((group) => group.items.length);
  }, [faqGroups, query, searching, topic]);

  return (
    <div className={styles.layout}>
      <nav aria-label="Help topics" className={styles.topics}>
        {faqGroups.map((group) => (
          <button
            key={group.id}
            type="button"
            className={cx("t-label-m", styles.topic, !searching && topic === group.id && styles.topicActive)}
            aria-current={!searching && topic === group.id ? "true" : undefined}
            onClick={() => {
              setQuery("");
              setTopic(group.id);
            }}
          >
            {group.title}
          </button>
        ))}
      </nav>

      <div className={styles.main}>
        <label className={styles.search}>
          <span className="t-label-m">Search help</span>
          <span className={styles.searchBox}>
            <Search size={20} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions…"
              className="t-body-m"
            />
          </span>
        </label>

        {groups.length ? (
          groups.map((group) => (
            <section key={group.id} id={group.id} aria-labelledby={`faq-${group.id}`}>
              <h2 id={`faq-${group.id}`} className={`t-h4 ${styles.groupTitle}`}>
                {group.title}
              </h2>
              {group.items.map((item) => (
                <details key={item.q} className={styles.item}>
                  <summary className="t-label-l">{item.q}</summary>
                  <p className="t-body-m">{item.a}</p>
                </details>
              ))}
            </section>
          ))
        ) : (
          <p className="t-body-m" role="status">
            No questions match “{query.trim()}”. Try another word, or contact us below.
          </p>
        )}
      </div>
    </div>
  );
}
