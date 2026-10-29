import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { templateSchema } from "@/lib/template-ids";
import { TEMPLATES } from "@/lib/site";

describe("Pinoy-only template integration", () => {
  it("keeps catalogue and shared validation aligned to all eight choices", () => {
    expect(templateSchema.options).toEqual(["parol", "snow", "bokeh", "globe", "fire", "simbang", "crafting", "caroling"]);
    expect(TEMPLATES.map((t) => t.id)).toEqual(templateSchema.options);
    expect(templateSchema.safeParse("MagicFam").success).toBe(false);
  });
  it("allows new templates in payment and owner-reservation database validation without lifting budgets", () => {
    const sql = readFileSync("drizzle/migrations/0005_pinoy_template_choices.sql", "utf8");
    const lists = [...sql.matchAll(/(?:CHECK \(template IN|NEW\.template NOT IN) \(([^)]+)\)/g)].map((match) => match[1] ?? "");
    expect(lists).toHaveLength(2);
    for (const list of lists) expect(list.replaceAll("'", "").split(",")).toEqual(templateSchema.options);
    expect(sql).toContain("hour_count>=3");
    expect(sql).toContain("account_spent+NEW.cost_usd>10");
    expect(sql).toContain("pg_advisory_xact_lock(724202610)");
  });
});