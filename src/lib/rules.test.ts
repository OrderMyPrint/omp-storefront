import { describe, expect, it } from "vitest";
import type { OptionRule } from "@/data/catalogue";
import { blockedOptions, brokenRules, ruleErrors } from "@/lib/rules";

const excludes: OptionRule = {
  whenGroup: "finish",
  whenOption: "soft-touch",
  effect: "EXCLUDES",
  thenGroup: "paper",
  thenOptions: ["kraft"],
  message: "Soft-touch can't go on kraft.",
};
const requires: OptionRule = {
  whenGroup: "method",
  whenOption: "screen",
  effect: "REQUIRES",
  thenGroup: "locations",
  thenOptions: ["front"],
  message: "Screen printing needs a front print.",
};
const groups = [
  { key: "finish", multi: false, options: ["none", "soft-touch"] },
  { key: "paper", multi: false, options: ["matte", "kraft"] },
  { key: "method", multi: false, options: ["dtf", "screen"] },
  { key: "locations", multi: true, options: ["front", "back"] },
];

describe("constraint rule hints", () => {
  it("matches the engine: EXCLUDES and REQUIRES", () => {
    expect(brokenRules([excludes], { finish: "soft-touch", paper: "kraft" })).toEqual([excludes]);
    expect(brokenRules([excludes], { finish: "none", paper: "kraft" })).toEqual([]);
    expect(brokenRules([requires], { method: "screen", locations: ["back"] })).toEqual([requires]);
    expect(brokenRules([requires], { method: "screen", locations: ["front", "back"] })).toEqual([]);
  });

  it("reports broken rules as CONSTRAINT_VIOLATION on the target group", () => {
    expect(ruleErrors([excludes], { finish: "soft-touch", paper: "kraft" })).toEqual([
      { code: "CONSTRAINT_VIOLATION", field: "selections.paper", message: excludes.message },
    ]);
  });

  it("disables options that would break a rule, in both directions, with the message", () => {
    const blocked = blockedOptions(
      [excludes, requires],
      { finish: "soft-touch", paper: "matte", method: "dtf", locations: ["back"] },
      groups,
    );
    expect(blocked.get("paper:kraft")).toBe(excludes.message);
    expect(blocked.get("method:screen")).toBe(requires.message);
    expect(blocked.has("finish:none")).toBe(false);

    const reverse = blockedOptions([excludes], { finish: "none", paper: "kraft" }, groups);
    expect(reverse.get("finish:soft-touch")).toBe(excludes.message);
  });

  it("never disables the option that is already selected", () => {
    const blocked = blockedOptions([excludes], { finish: "soft-touch", paper: "kraft" }, groups);
    expect(blocked.has("paper:kraft")).toBe(false);
    expect(blocked.has("finish:soft-touch")).toBe(false);
  });
});
