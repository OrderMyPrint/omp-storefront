"use client";

import { useId, useState } from "react";
import { CheckCircle2, Clock, FileText, Trash2, Upload } from "lucide-react";
import { Alert } from "@/components/ui/Alert/Alert";
import type { Product } from "@/data/catalogue";
import { routes } from "@/config/site";
import { cx } from "@/lib/cx";
import styles from "./Configurator.module.css";

export type PickedFile = { name: string; size: number; kind: "checked" | "manual" };
export type ArtworkState = { mode: "now" | "later"; files: Record<string, PickedFile> };

const MAX_BYTES = 50 * 1024 * 1024;
const ACCEPT = ".pdf,.png,.jpg,.jpeg,.svg,.cdr";
const CHECKED = ["pdf", "png", "jpg", "jpeg", "svg"];

function formatSize(bytes: number): string {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * Figma SF-ART-01 — guided upload per print slot. Files are checked in the
 * browser (type and size) and kept on this page only; the secure upload,
 * virus scan and pre-press review run on the server once checkout is live.
 */
export function ArtworkUpload({
  product,
  value,
  onChange,
}: {
  product: Product;
  value: ArtworkState;
  onChange: (next: ArtworkState) => void;
}) {
  const [active, setActive] = useState(product.artwork.slots[0]);
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const file = value.files[active];

  const pick = (picked: File | undefined) => {
    setError(null);
    if (!picked) return;
    const ext = picked.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ACCEPT.includes(`.${ext}`)) {
      setError(`${picked.name} is not a supported file type. Upload PDF, PNG, JPEG, SVG or CorelDRAW (CDR).`);
      return;
    }
    if (picked.size > MAX_BYTES) {
      setError(`${picked.name} is ${formatSize(picked.size)}. Files can be up to 50 MB.`);
      return;
    }
    onChange({
      ...value,
      files: {
        ...value.files,
        [active]: { name: picked.name, size: picked.size, kind: CHECKED.includes(ext) ? "checked" : "manual" },
      },
    });
  };

  const remove = () => {
    const files = { ...value.files };
    delete files[active];
    onChange({ ...value, files });
  };

  return (
    <div className={styles.artwork}>
      <div className={styles.modeRow} role="radiogroup" aria-label="When to upload artwork">
        {(["now", "later"] as const).map((mode) => (
          <label key={mode} className={`t-body-m ${styles.radio}`}>
            <input
              type="radio"
              name={`${product.slug}-artwork-mode`}
              checked={value.mode === mode}
              onChange={() => onChange({ ...value, mode })}
            />
            {mode === "now" ? "Upload now" : "Upload after checkout"}
          </label>
        ))}
      </div>

      {value.mode === "later" ? (
        <Alert tone="info" title="You can add artwork after checkout">
          We start printing only after your artwork is uploaded and approved by our pre-press team.
        </Alert>
      ) : (
        <>
          <div className={styles.slotTabs} role="tablist" aria-label="Print sides">
            {product.artwork.slots.map((slot) => {
              const done = Boolean(value.files[slot]);
              return (
                <button
                  key={slot}
                  type="button"
                  role="tab"
                  aria-selected={slot === active}
                  className={cx(`t-label-m ${styles.slotTab}`, slot === active && styles.slotActive)}
                  onClick={() => {
                    setError(null);
                    setActive(slot);
                  }}
                >
                  {done ? (
                    <CheckCircle2 size={18} aria-hidden="true" className={styles.okIcon} />
                  ) : (
                    <Upload size={18} aria-hidden="true" />
                  )}
                  {slot}
                  {done ? "" : " — needed"}
                </button>
              );
            })}
          </div>

          <figure className={styles.printArea}>
            <figcaption className="t-label-m">{active} — print area</figcaption>
            <div className={styles.canvas} aria-hidden="true">
              <div className={styles.bleed}>
                <div className={styles.trim}>
                  <div className={`t-label-s ${styles.safe}`}>{active.toUpperCase()} · your artwork here</div>
                </div>
              </div>
            </div>
            <p className="t-body-xs">{product.artwork.printArea}</p>
            <ul className={`t-body-xs ${styles.legend}`}>
              <li>
                <span className={styles.keyTrim} /> Trim (cut)
              </li>
              <li>
                <span className={styles.keyBleed} /> Bleed
              </li>
              <li>
                <span className={styles.keySafe} /> Safe area
              </li>
            </ul>
          </figure>

          {file ? (
            <div className={styles.fileRow}>
              <FileText size={28} aria-hidden="true" className={styles.fileIcon} />
              <div className={styles.fileText}>
                <p className="t-label-m">{file.name}</p>
                <p className={cx("t-body-xs", file.kind === "checked" ? styles.okText : styles.waitText)}>
                  {file.kind === "checked" ? (
                    <>
                      <CheckCircle2 size={14} aria-hidden="true" /> File type and size OK · pre-press review after
                      checkout
                    </>
                  ) : (
                    <>
                      <Clock size={14} aria-hidden="true" /> CorelDRAW file · reviewed manually by pre-press (attach a
                      PDF copy if you can)
                    </>
                  )}
                </p>
              </div>
              <span className="t-body-xs">{formatSize(file.size)}</span>
              <button type="button" className={styles.iconButton} onClick={remove} aria-label={`Remove ${file.name}`}>
                <Trash2 size={20} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <label htmlFor={inputId} className={styles.dropzone}>
              <Upload size={24} aria-hidden="true" />
              <span className="t-label-m">Choose a file for the {active.toLowerCase()}</span>
              <span className="t-body-xs">PDF (preferred), PNG, JPEG, SVG or CDR · up to 50 MB</span>
            </label>
          )}
          <input
            id={inputId}
            type="file"
            accept={ACCEPT}
            className="visually-hidden"
            onChange={(event) => {
              pick(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          {error ? (
            <Alert tone="error" title="This file can't be used" live>
              {error}
            </Alert>
          ) : null}
          <p className="t-body-xs">
            Not sure your file is ready? Read our <a href={routes.artworkGuidelines}>artwork guidelines</a>.
          </p>
        </>
      )}
    </div>
  );
}
