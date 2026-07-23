import { expect, test } from "@playwright/test";

test("core local ecommerce routes render and expose drawers", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("body")).toContainText(/Arogga|Store|Healthcare/i);
  await page.goto("/products/100001");
  await expect(page.locator("body")).toContainText(/Add to Cart|Buy Now/i);
  await page.goto("/account/orders");
  await expect(page.locator("body")).toContainText(/Orders|Login|Account/i);
  await page.goto("/checkout");
  await expect(page.locator("body")).toContainText(/Checkout|Login/i);
  await page.goto("/lab");
  await expect(page.locator("body")).toContainText(/All Lab Tests|Book lab tests with trusted diagnostic partners/i);
  await expect(page.locator(".lab-test-row").first()).toBeVisible({ timeout: 15000 });
  await expect(page.locator(".lab-test-row")).toHaveCount(220, { timeout: 15000 });
  await page.locator(".lab-test-row a[href^='/lab/tests/']").first().click();
  await expect(page).toHaveURL(/\/lab\/tests\//);
  await expect(page.locator("body")).toContainText(/Book Test|Sample Type/i);
  await page.goto("/lab/tests");
  await expect(page.locator("body")).toContainText(/Book Lab Tests from Home|CBC/i);
  await page.goto("/lab/tests/cbc-1000");
  await expect(page.locator("body")).toContainText(/CBC|Book Test|Sample Type/i);
});

test("catalog API paginates card-sized product responses", async ({ request }) => {
  const response = await request.get("/api/catalog/products?limit=3&page=1&sort=rating");
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.items).toHaveLength(3);
  expect(data.items[0]).toHaveProperty("id");
  expect(data.items[0]).toHaveProperty("image");
  expect(data.items[0]).not.toHaveProperty("description");
});


test("lab API serves independent paginated lab tests", async ({ request }) => {
  const response = await request.get("/api/lab/tests?limit=5&q=cbc");
  expect(response.ok()).toBeTruthy();
  const data = await response.json();
  expect(data.items.length).toBeGreaterThan(0);
  expect(data.items.length).toBeLessThanOrEqual(5);
  expect(data.facets.centers.length).toBeGreaterThanOrEqual(10);
});
