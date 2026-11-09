"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Copy, EyeOff, Plus, Trash2 } from "lucide-react";
import { ContentSection } from "@/components/content/ContentBlocks";
import { HomeSection } from "@/components/content/PageSections";
import { sectionAttrs } from "@/components/content/Section";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import type { ContentBlock } from "@/lib/content";
import helpStyles from "../help/help.module.css";
import styles from "./EditorCanvas.module.css";

/**
 * Message protocol with the admin (OrderMyPrint/omp-admin, VisualEditor):
 *   admin → canvas  { type: "omp-editor:render", page, selectedId }  ·  { type: "omp-editor:focus", id }
 *   canvas → admin  { type: "omp-editor:ready" } · "select" {id} · "action" {id, action} ·
 *                   "insert" {index} · "text" {id, field, value}
 * Only the admin origins below may drive the canvas; everything it renders is text.
 */
const ALLOWED_ORIGINS = (
  process.env.NEXT_PUBLIC_ADMIN_ORIGINS ?? "http://localhost:5173,https://omp-admin-two.vercel.app"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

type EditorPage = {
  key: string;
  title: string;
  overline: string | null;
  lead: string | null;
  blocks: ContentBlock[];
};

const LABELS: Record<string, string> = {
  hero: "Hero",
  assuranceStrip: "Assurance strip",
  categoryTiles: "Category tiles",
  productCarousel: "Product carousel",
  priceEstimator: "Price estimator",
  steps: "Steps",
  ctaBand: "Call-to-action band",
  imageGallery: "Image gallery",
  faqList: "FAQ list",
  richText: "Rich text",
  imageText: "Image + text",
  cards: "Cards",
  notice: "Notice",
};

export function EditorCanvas() {
  const [page, setPage] = useState<EditorPage | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [embedded, setEmbedded] = useState(true);
  /** False while the admin previews the page: no outlines, toolbars or typing. */
  const [editable, setEditable] = useState(true);
  const parentOrigin = useRef<string | null>(null);
  const editing = useRef<HTMLElement | null>(null);
  const pending = useRef<{ page: EditorPage; selectedId: string | null } | null>(null);

  const send = useCallback((message: Record<string, unknown>) => {
    if (parentOrigin.current) window.parent.postMessage(message, parentOrigin.current);
  }, []);

  useEffect(() => {
    if (window.parent === window) {
      setEmbedded(false);
      return;
    }
    const onMessage = (event: MessageEvent) => {
      if (event.source !== window.parent || !ALLOWED_ORIGINS.includes(event.origin)) return;
      parentOrigin.current = event.origin;
      const data = event.data as {
        type?: string;
        page?: EditorPage;
        selectedId?: string | null;
        id?: string;
        editable?: boolean;
      };
      if (data.type === "omp-editor:render" && data.page) {
        setEditable(data.editable !== false);
        const next = { page: data.page, selectedId: data.selectedId ?? null };
        // Don't re-render under the person's cursor while they type on the page.
        if (editing.current) pending.current = next;
        else {
          setPage(next.page);
          setSelected(next.selectedId);
        }
      }
      if (data.type === "omp-editor:focus" && data.id) {
        setSelected(data.id);
        document
          .querySelector(`[data-section-id="${CSS.escape(data.id)}"]`)
          ?.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    };
    window.addEventListener("message", onMessage);
    // Announce readiness to the parent. Chromium/Safari expose the parent origin; elsewhere try each allowed one.
    const ancestor = window.location.ancestorOrigins?.[0];
    const targets = ancestor && ALLOWED_ORIGINS.includes(ancestor) ? [ancestor] : ALLOWED_ORIGINS;
    for (const origin of targets) window.parent.postMessage({ type: "omp-editor:ready" }, origin);
    // Links, buttons and forms do nothing inside the editor (header and footer included).
    const block = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-editor-ui]")) return;
      if (target.closest("a, button, form, input, select, textarea")) e.preventDefault();
    };
    document.addEventListener("click", block, true);
    document.addEventListener("submit", block, true);
    return () => {
      window.removeEventListener("message", onMessage);
      document.removeEventListener("click", block, true);
      document.removeEventListener("submit", block, true);
    };
  }, []);

  const finishEditing = useCallback(() => {
    const el = editing.current;
    if (!el) return;
    el.removeAttribute("contenteditable");
    editing.current = null;
    if (pending.current) {
      setPage(pending.current.page);
      setSelected(pending.current.selectedId);
      pending.current = null;
    }
  }, []);

  const startEditing = (event: React.MouseEvent, blockId: string) => {
    if (!editable) return;
    const el = (event.target as HTMLElement).closest<HTMLElement>("[data-edit-field]");
    if (!el || editing.current) return;
    event.preventDefault();
    editing.current = el;
    try {
      el.contentEditable = "plaintext-only";
    } catch {
      el.contentEditable = "true";
    }
    el.focus();
    const field = el.dataset.editField!;
    el.oninput = () => send({ type: "omp-editor:text", id: blockId, field, value: el.textContent ?? "" });
    el.onblur = finishEditing;
    el.onkeydown = (e) => {
      if (e.key === "Escape" || (e.key === "Enter" && field !== "body")) {
        e.preventDefault();
        el.blur();
      }
    };
  };

  const select = (id: string) => {
    if (!editable) return;
    setSelected(id);
    send({ type: "omp-editor:select", id });
  };

  if (!embedded)
    return (
      <div className={`container ${styles.standalone}`}>
        <p className="t-body-l">This page is the canvas of the admin’s visual editor and shows nothing on its own.</p>
      </div>
    );
  if (!page) return <div className={styles.loading} aria-busy="true" />;

  const isHome = page.key === "home";
  const sections = page.blocks.map((block, index) => {
    const isSelected = editable && selected === block.id;
    return (
      <div
        key={block.id}
        className={`omp-section ${styles.section}`}
        {...sectionAttrs(block)}
        data-selected={isSelected ? "" : undefined}
        onClick={(e) => {
          // Click selects the section; clicking text in the selected section starts typing on it.
          if (isSelected && (e.target as HTMLElement).closest("[data-edit-field]")) startEditing(e, block.id);
          else select(block.id);
        }}
        onDoubleClick={(e) => startEditing(e, block.id)}
      >
        {isHome ? <HomeSection block={block} /> : <ContentSection block={block} inline />}
        {editable ? <span className={styles.outline} aria-hidden="true" /> : null}
        {isSelected ? (
          <div className={styles.toolbar} data-editor-ui="">
            <span className={styles.label}>{LABELS[block.type] ?? block.type}</span>
            {(
              [
                ["up", ChevronUp, "Move up"],
                ["down", ChevronDown, "Move down"],
                ["duplicate", Copy, "Duplicate"],
                ["hide", EyeOff, "Hide"],
                ["delete", Trash2, "Delete"],
              ] as const
            ).map(([action, Icon, label]) => (
              <button
                key={action}
                type="button"
                title={label}
                aria-label={label}
                onClick={(e) => {
                  e.stopPropagation();
                  send({ type: "omp-editor:action", id: block.id, action });
                }}
              >
                <Icon size={16} aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}
        {editable ? (
          <button
            type="button"
            className={styles.insert}
            data-editor-ui=""
            onClick={(e) => {
              e.stopPropagation();
              send({ type: "omp-editor:insert", index: index + 1 });
            }}
          >
            <Plus size={14} aria-hidden="true" /> Add section
          </button>
        ) : null}
      </div>
    );
  });

  return (
    <div className={styles.canvas}>
      {page.blocks.length === 0 ? (
        <div className={`container ${styles.empty}`} data-editor-ui="">
          <p className="t-body-l">This page has no sections yet.</p>
          <button type="button" onClick={() => send({ type: "omp-editor:insert", index: 0 })}>
            <Plus size={16} aria-hidden="true" /> Add the first section
          </button>
        </div>
      ) : isHome ? (
        sections
      ) : (
        <div className={`container ${helpStyles.page}`}>
          <PageIntro overline={page.overline ?? undefined} title={page.title} lead={page.lead ?? undefined} />
          {sections}
        </div>
      )}
    </div>
  );
}
