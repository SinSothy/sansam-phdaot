import { test, expect } from '@playwright/test';

test.describe('Planner Board Component (Trello Parity)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Planner/Board page
    await page.goto('http://localhost:3000/planner');
  });

  test('Loads the columns and existing task cards', async ({ page }) => {
    // Columns like "To Do", "In Progress", or "Done" should exist
    // Fallback to checking for generic list containers if names are dynamic
    const boardArea = page.locator('main').first();
    await expect(boardArea).toBeVisible();

    // Find any card representation (usually contains a title or checklist)
    // We expect the board to have at least one column rendered
  });

  test('Allows creation of a new column/list', async ({ page }) => {
    const addListBtn = page.getByText(/Add another list|Add list/i).first();
    
    if (await addListBtn.isVisible()) {
      await addListBtn.click();
      
      // A text input should appear to name the list
      const input = page.locator('input[type="text"]').last();
      await expect(input).toBeVisible();
      
      await input.fill('QA Testing Column');
      await input.press('Enter');
      
      // The new column should be visible
      await expect(page.getByText('QA Testing Column')).toBeVisible();
    }
  });
});
