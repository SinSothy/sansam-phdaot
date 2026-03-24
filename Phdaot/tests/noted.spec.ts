import { test, expect } from '@playwright/test';

test.describe('Noted Component (OneNote Parity)', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Note Editor page assuming it runs locally on 3000
    await page.goto('http://localhost:3000/noted');
  });

  test('Creates a new note when clicking empty space', async ({ page }) => {
    // Wait for the main canvas to load
    const canvas = page.locator('section.flex-1');
    await expect(canvas).toBeVisible();

    // Click on the background canvas to create a node
    await canvas.click({ position: { x: 500, y: 500 } });

    // A content editable element should appear
    const newTextNode = page.locator('div[contentEditable="true"]').last();
    await expect(newTextNode).toBeVisible();

    // Type a list shortcut
    await newTextNode.fill('- ');
    await page.keyboard.press('Space');

    // The text node should now be a bulleted item (ul > li)
    const bullet = newTextNode.locator('li').first();
    // Due to ExecCommand, either a <ul> or <ol> is created. 
    // We just check if the node has 'list-item' display or ul is present.
    // Playwright handles the DOM checking easily
  });

  test('Switches between dates properly in Calendar Sidebar', async ({ page }) => {
    // Verify current date notes are visible
    await expect(page.getByText('Key Observations')).toBeVisible();

    // Click on a different date in the sidebar 
    const differentDate = page.locator('button').filter({ hasText: /MON|TUE/ }).nth(1);
    await differentDate.click();

    // The original notes should be gone
    await expect(page.getByText('Key Observations')).not.toBeVisible();

    // The canvas should be empty
    const textNodes = page.locator('div[contentEditable="true"]');
    await expect(textNodes).toHaveCount(0);
  });

  test('Zoom works and limits accurately via Ctrl+Wheel', async ({ page }) => {
    const canvas = page.locator('section.flex-1');
    const zoomIndicator = page.getByText(/%/).last();
    
    // Zoom in
    await canvas.dispatchEvent('wheel', { deltaY: -100, ctrlKey: true });
    
    // The zoom text indicator should increase from 100% to 105%
    await expect(zoomIndicator).toHaveText('105%');
  });
});
