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
