const { expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} url - The URL to navigate to
   */
  async goto(url) {
    await this.page.goto(url);
  }

  /**
   * Wait for an element to be visible
   * @param {string} locator - The locator for the element
   * @param {number} timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator, timeout = 10000) {
    await this.page.locator(locator).waitFor({ state: 'visible', timeout });
  }

  /**
   * Click on an element with wait
   * @param {string} locator - The locator for the element
   */
  async click(locator) {
    await this.page.locator(locator).click();
  }

  /**
   * Fill input field
   * @param {string} locator - The locator for the input field
   * @param {string} text - The text to fill
   */
  async fill(locator, text) {
    await this.page.locator(locator).fill(text);
  }

  /**
   * Get text content from an element
   * @param {string} locator - The locator for the element
   * @returns {Promise<string>} The text content
   */
  async getText(locator) {
    return await this.page.locator(locator).textContent();
  }

  /**
   * Check if element is visible
   * @param {string} locator - The locator for the element
   * @returns {Promise<boolean>} True if visible, false otherwise
   */
  async isVisible(locator) {
    return await this.page.locator(locator).isVisible();
  }

  /**
   * Take screenshot with timestamp
   * @param {string} screenshotName - Name for the screenshot
   */
  async takeScreenshot(screenshotName) {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `${screenshotName}_${timestamp}.png`;
    await this.page.screenshot({ 
      path: path.join(screenshotDir, filename),
      fullPage: true 
    });
    return filename;
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Select option from dropdown by visible text
   * @param {string} locator - The locator for the select element
   * @param {string} text - The visible text to select
   */
  async selectByText(locator, text) {
    await this.page.locator(locator).selectOption({ label: text });
  }

  /**
   * Select option from dropdown by value
   * @param {string} locator - The locator for the select element
   * @param {string} value - The value to select
   */
  async selectByValue(locator, value) {
    await this.page.locator(locator).selectOption(value);
  }

  /**
   * Get page title
   * @returns {Promise<string>} The page title
   */
  async getTitle() {
    return await this.page.title();
  }

  /**
   * Scroll to element
   * @param {string} locator - The locator for the element
   */
  async scrollToElement(locator) {
    await this.page.locator(locator).scrollIntoViewIfNeeded();
  }

  /**
   * Wait for specific time
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms) {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Check if element exists
   * @param {string} locator - The locator for the element
   * @returns {Promise<boolean>} True if exists, false otherwise
   */
  async elementExists(locator) {
    const count = await this.page.locator(locator).count();
    return count > 0;
  }

  /**
   * Get attribute value
   * @param {string} locator - The locator for the element
   * @param {string} attribute - The attribute name
   * @returns {Promise<string>} The attribute value
   */
  async getAttribute(locator, attribute) {
    return await this.page.locator(locator).getAttribute(attribute);
  }
}

module.exports = BasePage;

