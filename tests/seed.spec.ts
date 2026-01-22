import { test, expect } from '@playwright/test';

/**
 * Seed test for Playwright agents.
 * This test is used by Playwright MCP to set up the page state for test generation.
 * It navigates to the dashboard and waits for test data to be visible.
 */
test('seed', async ({ page }) => {
  // Navigate to the dashboard
  await page.goto('/');
  
  // Wait for the dashboard to load
  await expect(page.getByText('AI Learning Hub')).toBeVisible();
  
  // Verify test data is visible (seeded by global-setup)
  await expect(page.getByRole('link', { name: 'Test Article' })).toBeVisible();
});
