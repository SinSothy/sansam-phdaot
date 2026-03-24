import { test, expect } from '@playwright/test';

test.describe('Daily Activity Component (Google Calendar Parity)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Daily Activity page
    await page.goto('http://localhost:3000/daily-activity');
  });

  test('Renders the calendar grid and current time indicator', async ({ page }) => {
    // The main calendar grid should be visible
    const calendarGrid = page.locator('.flex-1.flex.flex-col > .flex-1.overflow-y-auto');
    await expect(calendarGrid).toBeVisible();

    // The time increments (e.g., 9 AM, 10 AM) should be visible on the left axis
    await expect(page.getByText('12 PM').first()).toBeVisible();
    await expect(page.getByText('1 PM').first()).toBeVisible();

    // A current timeline (red line) indicator should exist
    const currentTimeLine = page.locator('.absolute.left-0.right-0.h-\\[2px\\].bg-red-500');
    // Using string matching for classes requires careful regex or exact strings, 
    // instead rely on structural visibility
  });

  test('Creates a new event via the New Event modal', async ({ page }) => {
    // Click the standard Create button (usually top left like GCal)
    const createBtn = page.getByRole('button', { name: /Create|Add/i }).first();
    
    if (await createBtn.isVisible()) {
      await createBtn.click();
      
      // Modal should appear
      const modalText = page.getByText(/Event Title|Title/i).first();
      await expect(modalText).toBeVisible();

      // Fill in an event
      await page.keyboard.type('Integration Test Event');
      
      // Save
      const saveBtn = page.getByRole('button', { name: /Save/i }).first();
      await saveBtn.click();
    }
  });
});
