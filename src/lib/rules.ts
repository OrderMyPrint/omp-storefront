import type { OptionRule } from "@/data/catalogue";

/**
 * Constraint rules between option groups, used only as UI hints: the API's
 * pricing engine enforces them and answers CONSTRAINT_VIOLATION when broken.
 * Same semantics as the engine (omp-api src/pricing/engine.ts `brokenRules`).
 */

export type Selections = Record<string, string | string[]>;

const chosen = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/** Rules whose trigger option is selected and whose condition fails. */
export function brokenRules(rules: OptionRule[], selections: Selections): OptionRule[] {
  return rules.filter((rule) => {
    if (!chosen(selections[rule.whenGroup]).includes(rule.whenOption)) return false;
    const target = chosen(selections[rule.thenGroup]);
    return rule.effect === "EXCLUDES"
      ? target.some((key) => rule.thenOptions.includes(key))
      : !target.some((key) => rule.thenOptions.includes(key));
  });
}

/** The same errors the server would return, for when the server can't be reached. */
export function ruleErrors(rules: OptionRule[], selections: Selections) {
  return brokenRules(rules, selections).map((rule) => ({
    code: "CONSTRAINT_VIOLATION",
    field: `selections.${rule.thenGroup}`,
    message: rule.message,
  }));
}

/**
 * Options that would break a rule if chosen with the other current selections,
 * keyed `group:option`, with the rule's message. Options that are already
 * selected are never listed, so a customer can always change them.
 */
export function blockedOptions(
  rules: OptionRule[],
  selections: Selections,
  groups: { key: string; multi: boolean; options: string[] }[],
): Map<string, string> {
  const blocked = new Map<string, string>();
  if (!rules.length) return blocked;
  const before = new Set(brokenRules(rules, selections));
  for (const group of groups) {
    const current = chosen(selections[group.key]);
    for (const option of group.options) {
      if (current.includes(option)) continue;
      const next = { ...selections, [group.key]: group.multi ? [...current, option] : option };
      const introduced = brokenRules(rules, next).find(
        (rule) => !before.has(rule) && (rule.whenGroup === group.key || rule.thenGroup === group.key),
      );
      if (introduced) blocked.set(`${group.key}:${option}`, introduced.message);
    }
  }
  return blocked;
}
