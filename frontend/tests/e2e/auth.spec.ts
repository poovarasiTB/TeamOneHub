import { test, expect } from '@playwright/test';

// Authentication E2E Tests
test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await expect(page).toHaveTitle(/TeamOne/);
    await expect(page.getByLabelText(/email/i)).toBeVisible();
    await expect(page.getByLabelText(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation error for invalid email', async ({ page }) => {
    await page.getByLabelText(/email/i).fill('invalid-email');
    await page.getByLabelText(/password/i).fill('Password123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email address/i)).toBeVisible();
  });

  test('should show validation error for empty password', async ({ page }) => {
    await page.getByLabelText(/email/i).fill('test@example.com');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/password is required/i)).toBeVisible();
  });

  test('should navigate to register page', async ({ page }) => {
    await page.getByText(/sign up/i).click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.getByLabelText(/email/i).fill('admin@teamone.local');
    await page.getByLabelText(/password/i).fill('Admin123!');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(/dashboard/i)).toBeVisible();
  });
});

// Dashboard E2E Tests
test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabelText(/email/i).fill('admin@teamone.local');
    await page.getByLabelText(/password/i).fill('Admin123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);
  });

  test('should display dashboard stats', async ({ page }) => {
    await expect(page.getByText(/total projects/i)).toBeVisible();
    await expect(page.getByText(/active tasks/i)).toBeVisible();
    await expect(page.getByText(/team members/i)).toBeVisible();
  });

  test('should navigate to projects page', async ({ page }) => {
    await page.getByText(/projects/i).click();
    await expect(page).toHaveURL(/\/work\/projects/);
  });

  test('should create new project', async ({ page }) => {
    await page.getByText(/new project/i).click();
    await expect(page).toHaveURL(/\/work\/projects\/new/);
  });
});

// Projects E2E Tests
test.describe('Projects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByLabelText(/email/i).fill('admin@teamone.local');
    await page.getByLabelText(/password/i).fill('Admin123!');
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);
    await page.goto('/work/projects');
  });

  test('should display projects list', async ({ page }) => {
    await expect(page.getByText(/projects/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /new project/i })).toBeVisible();
  });

  test('should filter projects by status', async ({ page }) => {
    await page.getByRole('combobox').selectOption('active');
    await expect(page.getByText(/active/i)).toBeVisible();
  });

  test('should search projects', async ({ page }) => {
    await page.getByPlaceholder(/search projects/i).fill('Test');
    await expect(page).toBeVisible();
  });

  test('should create new project', async ({ page }) => {
    await page.getByRole('button', { name: /new project/i }).click();
    await page.getByLabel(/project name/i).fill('E2E Test Project');
    await page.getByLabel(/description/i).fill('Test project created by E2E test');
    await page.getByRole('button', { name: /create project/i }).click();

    await expect(page).toHaveURL(/\/work\/projects/);
  });
});

// Accessibility E2E Tests
test.describe('Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('should have proper form labels', async ({ page }) => {
    await page.goto('/login');

    const emailLabel = await page.getByLabel(/email/i);
    const passwordLabel = await page.getByLabel(/password/i);

    await expect(emailLabel).toBeVisible();
    await expect(passwordLabel).toBeVisible();
  });

  test('should have proper button roles', async ({ page }) => {
    await page.goto('/login');

    const submitButton = page.getByRole('button', { name: /sign in/i });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toHaveAttribute('type', 'submit');
  });

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/login');

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBe('BUTTON');
  });
});

// Responsive Design E2E Tests
test.describe('Responsive Design', () => {
  test('should display correctly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page.getByLabelText(/email/i)).toBeVisible();
    await expect(page.getByLabelText(/password/i)).toBeVisible();
  });

  test('should display correctly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    await expect(page.getByLabelText(/email/i)).toBeVisible();
    await expect(page.getByLabelText(/password/i)).toBeVisible();
  });

  test('should display correctly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');

    await expect(page.getByLabelText(/email/i)).toBeVisible();
    await expect(page.getByLabelText(/password/i)).toBeVisible();
  });
});
