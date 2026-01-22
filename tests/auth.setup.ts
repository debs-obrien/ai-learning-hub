import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Ensure the auth directory exists
  const authDir = path.dirname(authFile);
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Navigate to login page
  await page.goto('/login');
  
  // Get password from environment variable
  const password = process.env.APP_PASSWORD;
  if (!password) {
    throw new Error('APP_PASSWORD environment variable is not set. Check your .env.test.local file.');
  }
  
  // Fill in password and submit (wrapped in test.step to mask password in reports)
  await setup.step('Enter login credentials', async () => {
    await page.getByPlaceholder('Enter your password').fill(password);
  });
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Check for authentication errors
  const errorMessage = page.getByText('Invalid password');
  if (await errorMessage.isVisible({ timeout: 1000 }).catch(() => false)) {
    throw new Error('Authentication failed. Check your APP_PASSWORD in .env.test.local');
  }
  
  // Wait for successful authentication and redirect to dashboard
  await expect(page).toHaveURL('/', { timeout: 10000 });
  
  // Verify we're on the dashboard
  await expect(page.getByText('AI Learning Hub')).toBeVisible();
  
  // Save signed-in state to reuse in other tests
  await page.context().storageState({ path: authFile });
});
