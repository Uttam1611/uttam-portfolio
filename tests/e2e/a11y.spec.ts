import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = ["/", "/projects", "/projects/agni-pulse", "/projects/envital", "/journey", "/experience", "/certifications", "/analytics", "/about", "/contact"];

for (const theme of ["dark", "light"] as const) {
  for (const route of routes) {
    test(`no axe violations on ${route} (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
      await page.goto(route);
      await page.waitForTimeout(400);
      const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
      expect(violations.map((v) => `${v.id}: ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`)).toEqual([]);
    });
  }
}
