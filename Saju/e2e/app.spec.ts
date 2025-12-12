import { test, expect } from '@playwright/test';

test.describe('App', () => {
  test('should display the home page', async ({ page }) => {
    await page.goto('/');

    // Check if the main title is visible
    await expect(page.getByText('Companion Foundry')).toBeVisible();
  });

  test('should display the slogan', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByText('기업 업무를 끝까지 함께하는 AI 동반자를 만듭니다')
    ).toBeVisible();
  });

  test('should display the development ready message', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('개발 환경이 준비되었습니다')).toBeVisible();
  });
});

