import { expect, test } from "@playwright/test";

test("mobile menu opens, navigates and closes", async ({ page, isMobile }) => {
  test.skip(!isMobile && (page.viewportSize()?.width ?? 0) >= 768, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.getByRole("navigation", { name: "Mobile" }).getByRole("link", { name: "Work" }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(page.getByRole("navigation", { name: "Mobile" })).toHaveCount(0);
});
