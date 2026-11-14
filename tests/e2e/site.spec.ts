import { expect, test } from "@playwright/test";
import { projects } from "../../src/content/projects";
import { certifications } from "../../src/content/education";
import { journey } from "../../src/content/journey";
import { photos } from "../../src/content/photos";
import { experiences } from "../../src/content/experience";

const total = projects.length;
const cvCluster = projects.filter((p) => p.cluster === "Deep Learning and Computer Vision").length;

const routes = ["/", "/projects", ...projects.map((p) => `/projects/${p.slug}`), "/journey", "/experience", "/certifications", "/analytics", "/about", "/contact", "/sitemap.xml", "/robots.txt"];

test.describe("routes", () => {
  for (const route of routes) {
    test(`loads ${route} without console errors or horizontal overflow`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(String(e)));
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      if (!route.includes(".")) {
        await expect(page.locator("h1").first()).toBeVisible();
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        expect(overflow).toBe(false);
      }
      expect(errors).toEqual([]);
    });
  }

  test("unknown route shows the 404 page", async ({ page }) => {
    const res = await page.goto("/nope");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
  });
});

test("every internal link on every page resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const route of routes.filter((r) => !r.includes("."))) {
    await page.goto(route);
    const hrefs = await page.$$eval("a[href]", (as) => as.map((a) => a.getAttribute("href") ?? ""));
    hrefs.filter((h) => h.startsWith("/") && !h.startsWith("//")).forEach((h) => seen.add(h.split("#")[0] || "/"));
  }
  for (const href of seen) {
    const res = await request.get(href, { maxRedirects: 5 });
    expect(res.status(), href).toBe(200);
  }
});

test("theme switch persists across reload and pages", async ({ page }) => {
  await page.goto("/");
  const start = await page.locator("html").getAttribute("data-theme");
  const target = start === "dark" ? "light" : "dark";
  await page.getByRole("button", { name: `Switch to ${target} theme` }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", target);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", target);
  await page.goto("/analytics");
  await expect(page.locator("html")).toHaveAttribute("data-theme", target);
});

test("project filters, search, sort and URL params work together", async ({ page }) => {
  await page.goto("/projects");
  const count = page.getByTestId("project-count");
  await expect(count).toContainText(`Showing ${total} of ${total}`);
  await page.getByRole("button", { name: "Deep Learning and Computer Vision", exact: true }).click();
  await expect(count).toContainText(`Showing ${cvCluster} of ${total}`);
  await expect(page).toHaveURL(/cluster=/);
  await page.getByRole("button", { name: "Reset filters" }).first().click();
  await expect(count).toContainText(`Showing ${total} of ${total}`);
  await page.getByLabel(/Search projects/).fill("fastapi");
  await expect(count).not.toContainText(`Showing ${total} of`);
  await expect(page).toHaveURL(/q=fastapi/);
  await page.getByLabel(/Search projects/).fill("zzzz-no-match");
  await expect(page.getByText("No case study matches")).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).first().click();
  await page.getByLabel("Sort").selectOption("az");
  await expect(page.getByTestId("project-row").first()).toHaveAttribute("data-slug", [...projects].sort((a, b) => a.title.localeCompare(b.title))[0]!.slug);
});

test("project filters are restored from the URL", async ({ page }) => {
  await page.goto("/projects?cluster=Quantum%20Machine%20Learning");
  await expect(page.getByTestId("project-count")).toContainText("Showing 1 of");
});

test("experience page separates internships, leadership and hackathons and expanders work", async ({ page }) => {
  await page.goto("/experience");
  const count = (c: string) => experiences.filter((e) => e.category === c).length;
  await expect(page.getByTestId("section-internships").getByTestId("exp-card")).toHaveCount(count("Internship"));
  await expect(page.getByTestId("section-leadership").getByTestId("exp-card")).toHaveCount(count("Leadership"));
  await expect(page.getByTestId("section-hackathons").getByTestId("exp-card")).toHaveCount(count("Hackathon"));
  const first = page.getByTestId("section-internships").getByTestId("exp-card").first();
  const summary = first.getByText("Show responsibilities and evidence");
  const firstLi = first.locator("details li").first();
  await expect(firstLi).toBeHidden();
  await summary.click();
  await expect(firstLi).toBeVisible();
  await summary.click();
  await expect(firstLi).toBeHidden();
});

test("skill matrix highlights on focus and filters by area", async ({ page }) => {
  await page.goto("/experience#skills");
  const rows = page.getByTestId("skill-row");
  const all = await rows.count();
  await page.getByRole("button", { name: "Machine Learning & Deep Learning", exact: true }).click();
  expect(await rows.count()).toBeLessThan(all);
  await expect(page.getByRole("button", { name: "Machine Learning & Deep Learning", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "All", exact: true }).click();
  expect(await rows.count()).toBe(all);
});

test("journey is a slide show with dates, flags and working navigation", async ({ page }) => {
  await page.goto("/journey");
  const count = page.getByTestId("journey-count");
  await expect(page.getByTestId("journey-flag")).toHaveCount(journey.length);
  await expect(count).toHaveText(`1 of ${journey.length}`);
  await expect(page.getByTestId("journey-slide")).toContainText(journey[0]!.title);
  await page.getByRole("button", { name: "Next milestone" }).click();
  await expect(count).toHaveText(`2 of ${journey.length}`);
  await expect(page.getByTestId("journey-slide")).toContainText(journey[1]!.title);
  await page.getByTestId("journey-flag").nth(5).click();
  await expect(count).toHaveText(`6 of ${journey.length}`);
  await page.getByRole("button", { name: "Previous milestone" }).click();
  await expect(count).toHaveText(`5 of ${journey.length}`);
  await page.getByTestId("journey-flag").last().click();
  await expect(page.getByRole("button", { name: "Next milestone" })).toBeDisabled();
});

test("certifications show all seven with verification links and filters", async ({ page }) => {
  await page.goto("/certifications");
  await expect(page.getByTestId("cert-card")).toHaveCount(certifications.length);
  expect(certifications).toHaveLength(7);
  for (const c of certifications) expect(c.credentialUrl).toMatch(/^https:\/\//);
  await page.getByRole("button", { name: "Google", exact: true }).click();
  await expect(page.getByTestId("cert-card")).toHaveCount(certifications.filter((c) => c.issuingOrganisation === "Google").length);
});

test("homepage photo story advances automatically and by buttons, thumbnails and keyboard", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const story = page.getByTestId("photo-story");
  const slides = photos.filter((p) => p.section === "slideshow");
  await story.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(page.getByTestId("photo-caption")).toHaveText(slides[0]!.caption);
  await expect(page.getByTestId("photo-caption")).toHaveText(slides[1]!.caption, { timeout: 12000 });
  await story.getByRole("button", { name: "Pause" }).click();
  await story.getByRole("button", { name: "Next photo" }).click();
  await expect(page.getByTestId("photo-caption")).toHaveText(slides[2]!.caption);
  await story.getByRole("button", { name: "Previous photo" }).click();
  await expect(page.getByTestId("photo-caption")).toHaveText(slides[1]!.caption);
  await story.getByRole("button", { name: new RegExp(slides[4]!.title) }).first().click();
  await expect(page.getByTestId("photo-caption")).toHaveText(slides[4]!.caption);
  await story.focus();
  await page.keyboard.press("End");
  await expect(page.getByTestId("photo-caption")).toHaveText(slides[slides.length - 1]!.caption);
});

test("analytics: degree progress, role profile, timeline year tabs and skill map respond", async ({ page }) => {
  await page.goto("/analytics");
  await expect(page.getByTestId("degree-percent")).toHaveText(/^\d{1,3}%$/);
  await expect(page.getByText("Four years").first()).toBeVisible();
  await page.getByRole("radio", { name: "Data Engineer" }).click();
  await expect(page.getByText("Strengths by role")).toBeVisible();
  await expect(page.getByText(/gaps/i)).toHaveCount(0);
  await expect(page.getByTestId("role-dims").locator("li")).toHaveCount(5);
  await page.getByRole("tab", { name: "2026" }).click();
  await expect(page.getByTestId("timeline-detail")).toContainText("2026");
  await page.getByRole("tab", { name: "Date to be added" }).click();
  await expect(page.getByTestId("timeline-detail")).toBeVisible();
  await page.getByRole("button", { name: /^Python, / }).first().click();
  await expect(page.getByTestId("skillmap-detail")).toContainText("Python");
});

test("theme applies on every page", async ({ page }) => {
  for (const route of ["/", "/projects", "/journey", "/experience", "/certifications", "/analytics", "/about", "/contact"]) {
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe("rgb(244, 247, 251)");
  }
});

test("Envital is honest: discontinued, team project, hackathon results as placements", async ({ page }) => {
  await page.goto("/projects/envital");
  await expect(page.getByText("Discontinued").first()).toBeVisible();
  await expect(page.getByText("Top 5 finalist").first()).toBeVisible();
  await expect(page.locator("main")).not.toContainText(/winner of|won /i);
});

test("home reaches a case study in at most two interactions", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Read the case study" }).first().click();
  await expect(page.locator("h1")).toContainText("Agni-Pulse");
});

test("skip link and keyboard focus are available", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});

test("resume downloads as a PDF and every resume button points to it", async ({ page, request }) => {
  const viaRoute = await request.get("/resume");
  expect(viaRoute.status()).toBe(200);
  expect(viaRoute.headers()["content-type"]).toContain("application/pdf");
  await page.goto("/");
  const href = await page.getByRole("link", { name: "Download resume" }).first().getAttribute("href");
  expect(href).toBe("/resume/Uttam-Singh-Resume.pdf");
});

test("contact page lists the email, LinkedIn and GitHub links", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByRole("link", { name: /Email/ })).toHaveAttribute("href", /^mailto:.+@.+/);
  await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", /linkedin\.com\/in\//);
  await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", /github\.com\//);
});
