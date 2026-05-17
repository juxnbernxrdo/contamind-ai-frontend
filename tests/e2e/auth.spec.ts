import { test, expect } from '@playwright/test';

test.describe('Auth Flow & Routing', () => {
  test('Should show 404 for invalid route and preserve back navigation', async ({ page }) => {
    // Navigating to home
    await page.goto('/');
    
    // Check initial layout to verify we are not in 404
    await expect(page.locator('text=Contabilidad que piensa')).toBeVisible();
    
    // Use an unprotected route to avoid middleware redirect to login
    await page.goto('/unprotected-invalid-route');
    
    // Should render the custom Not Found page
    // Using a more specific locator to avoid layout h1
    const mainHeading = page.locator('main h1, .min-h-screen h1');
    await expect(mainHeading).toContainText('404');
    await expect(page.locator('h2')).toContainText('Página no encontrada');

    // Back navigation test
    await page.goBack();
    
    // We should be back on home
    await expect(page.locator('text=Contabilidad que piensa')).toBeVisible();
  });

  test('Login and Register pages render with their respective forms', async ({ page }) => {
    await page.goto('/auth/login');
    // Use specific locator for the form header
    await expect(page.locator('h2')).toContainText('Bienvenido de vuelta');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    await page.goto('/auth/register');
    // Avoid strict mode violation by selecting the heading inside the register form container
    await expect(page.locator('h1:has-text("Crear una cuenta")')).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
  });

  test('Protected route redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('Form validation with Zod and React Hook Form', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation messages
    await expect(page.locator('text=Ingresa un correo electrónico válido')).toBeVisible();
    await expect(page.locator('text=La contraseña debe tener al menos 6 caracteres')).toBeVisible();
    
    // Enter invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await expect(page.locator('text=Ingresa un correo electrónico válido')).toBeVisible();
  });
});
