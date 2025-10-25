const fs = require('fs');
const path = require('path');

class TestHelper {
  /**
   * Take screenshot with custom name
   * @param {Page} page - Playwright page object
   * @param {string} name - Screenshot name
   * @returns {Promise<string>} Screenshot path
   */
  static async takeScreenshot(page, name) {
    const screenshotDir = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const filename = `${name}_${timestamp}.png`;
    const filepath = path.join(screenshotDir, filename);
    
    await page.screenshot({ 
      path: filepath,
      fullPage: true 
    });
    
    return filepath;
  }

  /**
   * Wait for element with custom timeout
   * @param {Page} page - Playwright page object
   * @param {string} selector - Element selector
   * @param {number} timeout - Timeout in milliseconds
   */
  static async waitForElement(page, selector, timeout = 10000) {
    await page.locator(selector).waitFor({ 
      state: 'visible', 
      timeout 
    });
  }

  /**
   * Wait for navigation
   * @param {Page} page - Playwright page object
   */
  static async waitForNavigation(page) {
    await page.waitForLoadState('networkidle');
  }

  /**
   * Get random element from array
   * @param {Array} array - Input array
   * @returns {*} Random element
   */
  static getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Format currency string to number
   * @param {string} currencyString - Currency string (e.g., "$10.00")
   * @returns {number} Numeric value
   */
  static parseCurrency(currencyString) {
    return parseFloat(currencyString.replace(/[^0-9.]/g, ''));
  }

  /**
   * Format number to currency string
   * @param {number} amount - Numeric amount
   * @param {string} currency - Currency symbol
   * @returns {string} Formatted currency string
   */
  static formatCurrency(amount, currency = '$') {
    return `${currency}${amount.toFixed(2)}`;
  }

  /**
   * Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   */
  static async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum number of retries
   * @param {number} delay - Initial delay in milliseconds
   * @returns {Promise<*>} Function result
   */
  static async retry(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) {
          throw error;
        }
        await this.sleep(delay * Math.pow(2, i));
      }
    }
  }

  /**
   * Generate test report summary
   * @param {Array} testResults - Array of test results
   * @returns {Object} Report summary
   */
  static generateTestSummary(testResults) {
    const total = testResults.length;
    const passed = testResults.filter(r => r.status === 'passed').length;
    const failed = testResults.filter(r => r.status === 'failed').length;
    const skipped = testResults.filter(r => r.status === 'skipped').length;
    
    return {
      total,
      passed,
      failed,
      skipped,
      passRate: total > 0 ? ((passed / total) * 100).toFixed(2) + '%' : '0%'
    };
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid, false otherwise
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate phone number format
   * @param {string} phone - Phone number to validate
   * @returns {boolean} True if valid, false otherwise
   */
  static isValidPhone(phone) {
    const phoneRegex = /^\d{10,15}$/;
    return phoneRegex.test(phone.replace(/[^0-9]/g, ''));
  }

  /**
   * Get current date in specified format
   * @param {string} format - Date format (default: YYYY-MM-DD)
   * @returns {string} Formatted date
   */
  static getCurrentDate(format = 'YYYY-MM-DD') {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day);
  }

  /**
   * Create directory if not exists
   * @param {string} dirPath - Directory path
   */
  static ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Clean up old files in directory
   * @param {string} dirPath - Directory path
   * @param {number} maxAgeInDays - Maximum age in days
   */
  static cleanupOldFiles(dirPath, maxAgeInDays = 7) {
    if (!fs.existsSync(dirPath)) {
      return;
    }
    
    const now = Date.now();
    const maxAge = maxAgeInDays * 24 * 60 * 60 * 1000;
    
    fs.readdirSync(dirPath).forEach(file => {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
      }
    });
  }
}

module.exports = TestHelper;

