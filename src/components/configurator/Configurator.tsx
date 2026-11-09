"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Minus, Plus, Receipt, ShieldCheck, ShoppingCart } from "lucide-react";
import { Alert } from "@/components/ui/Alert/Alert";
import { Button } from "@/components/ui/Button/Button";
import type { ChoiceStep, MultiStep, Product } from "@/data/catalogue";
import { routes } from "@/config/site";
import { addToCart } from "@/lib/cart";
import { cx } from "@/lib/cx";
import { formatINR, formatQuantity } from "@/lib/format";
import {
  coloursApply,
  defaultConfiguration,
  describeConfiguration,
  priceConfiguration,
  type Configuration,
} from "@/lib/pricing";
import { blockedOptions, ruleErrors } from "@/lib/rules";
import { usePricePreview } from "@/lib/usePricePreview";
import { ArtworkUpload, type ArtworkState } from "./ArtworkUpload";
import { TierTable } from "./TierTable";
import styles from "./Configurator.module.css";

function StepHeader({ number, title, hint, done }: { number: number; title: string; hint: string; done?: boolean }) {
  return (
    <div className={styles.stepHead}>
      <span className={cx(styles.stepNumber, done && styles.stepDone)} aria-hidden="true">
        {done ? <Check size={18} /> : number}
      </span>
      <div>
        <h2 className={`t-h4 ${styles.stepTitle}`}>{title}</h2>
        <p className="t-body-xs">{hint}</p>
      </div>
    </div>
  );
}

/** Constraint errors for one option step, shown under its choices. */
function StepErrors({ errors }: { errors: { code: string; field: string; message: string }[] }) {
  if (!errors.length) return null;
  return (
    <Alert tone="error" title={errors[0].message}>
      {errors.length > 1 ? (
        <ul>
          {errors.slice(1).map((error) => (
            <li key={error.message}>{error.message}</li>
          ))}
        </ul>
      ) : null}
    </Alert>
  );
}

function priceHint(
  choice: { perUnit?: number; unitPrice?: number; detail?: string },
  noun: string,
): string | undefined {
  if (choice.unitPrice !== undefined) return `${formatINR(choice.unitPrice, { decimals: 0 })} per ${noun}`;
  if (choice.perUnit) {
    const decimals = Number.isInteger(choice.perUnit) ? 0 : 2;
    return `+ ${formatINR(choice.perUnit, { decimals })} per ${noun}`;
  }
  return choice.detail;
}

/** Figma SF-PDP-01…07 — numbered option steps, quantity, artwork and live price. */
export function Configurator({ product }: { product: Product }) {
  const router = useRouter();
  const [config, setConfig] = useState<Configuration>(() => defaultConfiguration(product));
  const [artwork, setArtwork] = useState<ArtworkState>({ mode: "now", files: {} });
  const [breakdownOpen, setBreakdownOpen] = useState(true);
  const [added, setAdded] = useState(false);

  const local = useMemo(() => priceConfiguration(product, config), [product, config]);
  const preview = usePricePreview(product, config);
  const minimum = Math.min(...product.tiers.map((tier) => tier.quantity));
  const quoteFrom = product.quantity.kind === "sizes" ? product.quantity.quoteFrom : Infinity;

  // The server's price wins whenever it is available for this exact configuration;
  // otherwise the local estimate is shown and labelled as an estimate.
  const server = preview.status === "ok" ? preview.price : null;
  const price = server
    ? {
        quantity: server.quantity,
        lines: server.lines.map((line) => ({ label: line.label, amount: Number(line.amount) })),
        subtotal: Number(server.subtotal ?? 0),
        gst: Number(server.gst ?? 0),
        total: Number(server.total ?? 0),
      }
    : local;
  const rules = useMemo(() => product.rules ?? [], [product]);
  // Constraint rules are hints only: options that would break one are disabled with
  // the rule's message, and the server's CONSTRAINT_VIOLATION errors are shown inline.
  const blocked = useMemo(
    () =>
      blockedOptions(
        rules,
        config.selections,
        product.steps.map((step) => ({
          key: step.id,
          multi: step.kind === "multi",
          options: step.choices.map((choice) => choice.id),
        })),
      ),
    [rules, config.selections, product.steps],
  );
  const serverErrors = server ? (server.valid ? [] : server.errors) : ruleErrors(rules, config.selections);
  const belowMinimum = server
    ? serverErrors.some((error) => error.code === "QUANTITY_BELOW_MINIMUM")
    : local.quantity < minimum;
  const needsQuote = server ? server.requiresQuote : local.quantity >= quoteFrom;
  const otherErrors = serverErrors.filter((error) => error.code !== "QUANTITY_BELOW_MINIMUM");
  const cannotOrder = belowMinimum || needsQuote || otherErrors.length > 0;
  const stepErrors = (stepId: string) =>
    otherErrors.filter((error) => error.code === "CONSTRAINT_VIOLATION" && error.field === `selections.${stepId}`);
  const updating = preview.status === "loading";
  const missingArtwork = artwork.mode === "now" && product.artwork.slots.some((slot) => !artwork.files[slot]);

  const update = (patch: Partial<Configuration>) => {
    setAdded(false);
    setConfig((current) => ({ ...current, ...patch }));
  };

  const selectChoice = (step: ChoiceStep, id: string) =>
    update({ selections: { ...config.selections, [step.id]: id } });

  const toggleMulti = (step: MultiStep, id: string) => {
    const current = (config.selections[step.id] as string[]) ?? [];
    const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
    if (!next.length) return; // at least one print location
    update({
      selections: { ...config.selections, [step.id]: next },
      colours: { ...config.colours, [id]: config.colours[id] ?? 1 },
    });
  };

  const handleAdd = () => {
    const noun = price.quantity === 1 ? product.unitNoun.one : product.unitNoun.many;
    addToCart({
      slug: product.slug,
      name: product.name,
      image: product.image,
      quantity: price.quantity,
      unitLabel: noun,
      options: describeConfiguration(product, config),
      subtotal: price.subtotal,
      gstRate: server ? Number(server.gstRate) / 100 : product.gstRate,
      pricingVersionId: server?.pricingVersionId,
      artwork: artwork.mode,
      files: Object.entries(artwork.files).map(([slot, file]) => `${slot}: ${file.name}`),
    });
    setAdded(true);
  };

  let stepNumber = 0;
  const noun = product.unitNoun.one;
  const gstPercent = server ? Number(server.gstRate) : Math.round(product.gstRate * 100);
  const priceSource =
    preview.status === "ok"
      ? { tone: "live", text: "Live price from our pricing server" }
      : preview.status === "loading"
        ? { tone: "pending", text: "Checking the price with our server…" }
        : preview.status === "error"
          ? { tone: "estimate", text: "Estimate — our pricing server can't be reached right now" }
          : { tone: "estimate", text: "Estimate" };

  return (
    <div className={styles.configurator}>
      {product.steps.map((step) => {
        stepNumber += 1;
        if (step.kind === "multi") {
          const selected = (config.selections[step.id] as string[]) ?? [];
          const showColours = coloursApply(step, config);
          return (
            <section key={step.id} className={styles.step} aria-labelledby={`step-${step.id}`}>
              <StepHeader number={stepNumber} title={step.title} hint={step.hint} />
              <fieldset className={styles.choices}>
                <legend id={`step-${step.id}`} className="visually-hidden">
                  {step.title}
                </legend>
                {step.choices.map((choice) => {
                  const unavailable = choice.unavailable ?? blocked.get(`${step.id}:${choice.id}`);
                  return (
                    <label
                      key={choice.id}
                      className={cx(
                        styles.card,
                        styles.checkCard,
                        selected.includes(choice.id) && styles.selected,
                        unavailable && styles.unavailable,
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(choice.id)}
                        disabled={Boolean(unavailable)}
                        onChange={() => toggleMulti(step, choice.id)}
                      />
                      <span className={styles.cardText}>
                        <span className="t-label-l">{choice.label}</span>
                        <span className="t-body-xs">
                          {unavailable ??
                            [choice.detail, choice.perUnit ? `+ ₹${choice.perUnit} per ${noun}` : null]
                              .filter(Boolean)
                              .join(" · ")}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              <StepErrors errors={stepErrors(step.id)} />
              {showColours && step.coloursPerChoice ? (
                <div className={styles.colourCounts}>
                  {step.choices
                    .filter((choice) => selected.includes(choice.id))
                    .map((choice) => {
                      const value = config.colours[choice.id] ?? 1;
                      const set = (next: number) =>
                        update({ colours: { ...config.colours, [choice.id]: Math.min(6, Math.max(1, next)) } });
                      return (
                        <div
                          key={choice.id}
                          className={styles.miniStepper}
                          role="group"
                          aria-label={`${choice.label}: number of colours`}
                        >
                          <span className="t-label-m">{choice.label}: colours</span>
                          <div className={styles.stepperBox}>
                            <button
                              type="button"
                              onClick={() => set(value - 1)}
                              disabled={value <= 1}
                              aria-label="Fewer colours"
                            >
                              <Minus size={18} aria-hidden="true" />
                            </button>
                            <output className="t-label-l">{value}</output>
                            <button
                              type="button"
                              onClick={() => set(value + 1)}
                              disabled={value >= 6}
                              aria-label="More colours"
                            >
                              <Plus size={18} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  <p className="t-body-xs">
                    Screen printing needs one screen per colour per location (
                    {formatINR(step.coloursPerChoice.perColour, { decimals: 0 })} each, once per order).
                  </p>
                </div>
              ) : null}
            </section>
          );
        }

        const selectedId = config.selections[step.id] as string;
        return (
          <section key={step.id} className={styles.step} aria-labelledby={`step-${step.id}`}>
            <StepHeader number={stepNumber} title={step.title} hint={step.hint} />
            {step.note ? <p className={`t-label-s ${styles.note}`}>{step.note}</p> : null}
            <fieldset className={cx(styles.choices, step.kind === "swatch" && styles.swatches)}>
              <legend id={`step-${step.id}`} className="visually-hidden">
                {step.title}
              </legend>
              {step.choices.map((choice) => {
                const isSelected = selectedId === choice.id;
                const unavailable = choice.unavailable ?? blocked.get(`${step.id}:${choice.id}`);
                if (step.kind === "swatch") {
                  return (
                    <label
                      key={choice.id}
                      className={cx(styles.swatch, isSelected && styles.swatchSelected)}
                      title={unavailable}
                    >
                      <input
                        type="radio"
                        name={`${product.slug}-${step.id}`}
                        checked={isSelected}
                        disabled={Boolean(unavailable)}
                        onChange={() => selectChoice(step, choice.id)}
                        className="visually-hidden"
                      />
                      <span className={styles.swatchDot} style={{ background: choice.swatch }} aria-hidden="true" />
                      <span className="t-body-xs">{choice.label}</span>
                    </label>
                  );
                }
                return (
                  <label
                    key={choice.id}
                    className={cx(styles.card, isSelected && styles.selected, unavailable && styles.unavailable)}
                  >
                    <input
                      type="radio"
                      name={`${product.slug}-${step.id}`}
                      checked={isSelected}
                      disabled={Boolean(unavailable)}
                      onChange={() => selectChoice(step, choice.id)}
                      className="visually-hidden"
                    />
                    <span className={styles.cardText}>
                      <span className="t-label-l">{choice.label}</span>
                      <span className="t-body-xs">{unavailable ?? priceHint(choice, noun)}</span>
                    </span>
                    {isSelected ? <Check size={20} aria-hidden="true" className={styles.tick} /> : null}
                  </label>
                );
              })}
            </fieldset>
            <StepErrors errors={stepErrors(step.id)} />
          </section>
        );
      })}

      {/* Quantity */}
      <section className={styles.step} aria-labelledby="step-quantity">
        <StepHeader
          number={++stepNumber}
          title={product.quantity.kind === "sizes" ? "Quantity by size" : "Quantity"}
          hint={product.quantity.hint}
        />
        <h3 id="step-quantity" className="visually-hidden">
          Quantity
        </h3>
        {product.quantity.kind === "sizes" ? (
          <div className={styles.sizeBox}>
            <div className={styles.sizeGrid}>
              {product.quantity.sizes.map((size) => (
                <label key={size} className={styles.sizeField}>
                  <span className="t-label-s">{size}</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={9999}
                    value={config.sizes[size] || ""}
                    placeholder="0"
                    onChange={(event) => {
                      const value = Math.max(0, Math.min(9999, Math.floor(Number(event.target.value) || 0)));
                      update({ sizes: { ...config.sizes, [size]: value } });
                    }}
                    className="t-label-l"
                  />
                </label>
              ))}
            </div>
            <div className={styles.sizeTotal}>
              <span className="t-body-m">Total quantity</span>
              <strong className="t-h5">{formatQuantity(price.quantity)} pcs</strong>
            </div>
            <p className="t-body-xs">
              {product.quantity.surchargeSizes.length && product.quantity.surcharge
                ? `${product.quantity.surchargeSizes[0]} and above: + ${formatINR(product.quantity.surcharge, { decimals: 0 })} per piece · `
                : null}
              minimum {minimum} pieces
            </p>
          </div>
        ) : (
          <div className={styles.quantityRow}>
            <QuantityInput
              value={config.quantity}
              min={minimum}
              steps={product.tiers.map((tier) => tier.quantity)}
              onChange={(quantity) => update({ quantity })}
            />
          </div>
        )}
        <TierTable product={product} quantity={price.quantity} quoteFrom={quoteFrom} />
        {belowMinimum ? (
          <Alert tone="warning" title={`Minimum order is ${formatQuantity(minimum)} ${product.unitNoun.many}`}>
            Add more to see your price, or ask us for a quotation.
          </Alert>
        ) : null}
        {needsQuote ? (
          <Alert tone="info" title={`Ordering ${formatQuantity(quoteFrom)}+ pieces?`}>
            Orders this size are priced by our sales team as a bulk quotation — you can review and accept it online.
          </Alert>
        ) : null}
      </section>

      {/* Artwork */}
      <section className={styles.step} aria-labelledby="step-artwork">
        <StepHeader
          number={++stepNumber}
          title="Upload artwork"
          hint={`${product.artwork.slots.join(" and ")} · print areas shown`}
        />
        <h3 id="step-artwork" className="visually-hidden">
          Upload artwork
        </h3>
        <ArtworkUpload
          product={product}
          value={artwork}
          onChange={(next) => {
            setAdded(false);
            setArtwork(next);
          }}
        />
      </section>

      {/* Price breakdown */}
      <section className={styles.summary} aria-labelledby="price-title">
        <button
          type="button"
          className={styles.summaryToggle}
          aria-expanded={breakdownOpen}
          aria-controls="price-lines"
          onClick={() => setBreakdownOpen((value) => !value)}
        >
          <h2 id="price-title" className="t-h4">
            Price breakdown
          </h2>
          <span className="t-label-s">{breakdownOpen ? "Hide" : "Show"}</span>
        </button>
        <p className={`t-label-s ${styles.source}`} data-tone={priceSource.tone} role="status">
          {priceSource.text}
        </p>
        {otherErrors.length ? (
          <Alert tone="error" title="This combination can't be priced">
            <ul>
              {otherErrors.map((error) => (
                <li key={`${error.field}-${error.code}`}>{error.message}</li>
              ))}
            </ul>
          </Alert>
        ) : null}
        <dl
          id="price-lines"
          className={cx(styles.lines, updating && styles.updating)}
          hidden={!breakdownOpen}
          aria-busy={updating}
        >
          {price.lines.map((line) => (
            <div key={line.label} className={styles.line}>
              <dt className="t-body-m">{line.label}</dt>
              <dd className="t-label-l">{formatINR(line.amount)}</dd>
            </div>
          ))}
          <div className={cx(styles.line, styles.lineRule)}>
            <dt className="t-body-m">Subtotal</dt>
            <dd className="t-label-l">{formatINR(price.subtotal)}</dd>
          </div>
          <div className={styles.line}>
            <dt className="t-body-m">GST ({gstPercent}%)</dt>
            <dd className="t-label-l">{formatINR(price.gst)}</dd>
          </div>
          <div className={styles.line}>
            <dt className="t-body-m">Delivery</dt>
            <dd className="t-body-m">Calculated at checkout</dd>
          </div>
        </dl>
        <div className={styles.totalRow}>
          <span className="t-h5">{server ? "Total" : "Estimated total"}</span>
          <span className={cx("t-price-l", updating && styles.updating)} aria-live="polite">
            {cannotOrder ? "—" : formatINR(price.total)}
          </span>
        </div>
        <p className="t-body-xs">
          Includes your selected options and GST. Delivery is added at checkout, where the price is confirmed again.
        </p>

        {added ? (
          <Alert tone="success" title="Added to your cart" live>
            {missingArtwork ? "Remember to add your artwork before checkout. " : null}
            <a href={routes.cart}>View cart</a>
          </Alert>
        ) : null}

        <div className={styles.ctas}>
          {needsQuote ? (
            <Button href={`${routes.quote}?product=${product.slug}`} variant="accent" fullWidth>
              Request a bulk quote
            </Button>
          ) : (
            <>
              <Button
                variant="accent"
                icon={ShoppingCart}
                onClick={handleAdd}
                disabled={cannotOrder || updating}
                fullWidth
              >
                Add to cart
              </Button>
              <Button href={`${routes.quote}?product=${product.slug}`} variant="secondary" fullWidth>
                Request bulk quote
              </Button>
            </>
          )}
        </div>
        {added ? (
          <Button variant="ghost" onClick={() => router.push(routes.cart)} fullWidth>
            Go to cart
          </Button>
        ) : null}
        <ul className={`t-body-xs ${styles.trust}`}>
          <li>
            <ShieldCheck size={16} aria-hidden="true" /> Secure checkout
          </li>
          <li>
            <Eye size={16} aria-hidden="true" /> Pre-press review
          </li>
          <li>
            <Receipt size={16} aria-hidden="true" /> GST invoice
          </li>
        </ul>
      </section>

      {/* Mobile sticky price bar (SF-PDP-01c-M) */}
      <div className={styles.stickyBar}>
        <div>
          <p className="t-body-xs">{server ? "Total" : "Estimated total"}</p>
          <p className="t-price-m">{cannotOrder ? "—" : formatINR(price.total)}</p>
        </div>
        <Button href="#price-title" variant="accent">
          Review price
        </Button>
      </div>
    </div>
  );
}

/** Quantity stepper that moves between tiers but also accepts any typed amount. */
function QuantityInput({
  value,
  min,
  steps,
  onChange,
}: {
  value: number;
  min: number;
  steps: number[];
  onChange: (value: number) => void;
}) {
  const sorted = [...steps].sort((a, b) => a - b);
  const prev = [...sorted].reverse().find((step) => step < value) ?? min;
  const next = sorted.find((step) => step > value);
  return (
    <div className={styles.quantityField}>
      <label htmlFor="quantity-input" className="t-label-m">
        Quantity
      </label>
      <div className={styles.stepperBox}>
        <button type="button" onClick={() => onChange(prev)} disabled={value <= min} aria-label="Previous price tier">
          <Minus size={20} aria-hidden="true" />
        </button>
        <input
          id="quantity-input"
          type="number"
          inputMode="numeric"
          min={1}
          max={100000}
          value={value || ""}
          onChange={(event) => onChange(Math.max(0, Math.min(100000, Math.floor(Number(event.target.value) || 0))))}
          className="t-label-l"
        />
        <button type="button" onClick={() => next && onChange(next)} disabled={!next} aria-label="Next price tier">
          <Plus size={20} aria-hidden="true" />
        </button>
      </div>
      <p className="t-body-xs">Minimum {formatQuantity(min)} · the buttons jump between price tiers</p>
    </div>
  );
}
