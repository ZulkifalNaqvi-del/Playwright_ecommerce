const { test: baseTest } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const RegistrationPage = require('../pages/RegistrationPage');
const LoginPage = require('../pages/LoginPage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const Logger = require('../utils/Logger');
const TestHelper = require('../utils/TestHelper');

/**
 * Custom test fixtures with page objects and utilities
 */
const test = baseTest.extend({
  // Page Objects
  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  productPage: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    await use(productPage);
  },

  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  // Utilities
  logger: async ({}, use) => {
    const logger = new Logger();
    await use(logger);
  },

  testHelper: async ({}, use) => {
    await use(TestHelper);
  },

  // Auto-screenshot on failure
  autoScreenshot: [async ({ page }, use, testInfo) => {
    await use();
    
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = await TestHelper.takeScreenshot(
        page, 
        `failure-${testInfo.title.replace(/\s+/g, '-')}`
      );
      console.log(`Screenshot saved: ${screenshotPath}`);
      
      // Attach to Playwright report
      await testInfo.attach('failure-screenshot', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }
  }, { auto: true }],
});

module.exports = { test };

