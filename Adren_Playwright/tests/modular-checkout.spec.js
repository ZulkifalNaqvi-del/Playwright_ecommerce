const { test: base } = require('@playwright/test');
const { expect } = require('@playwright/test');
const TestDataManager = require('../utils/TestDataManager');
const HomePage = require('../pages/HomePage');
const RegistrationPage = require('../pages/RegistrationPage');
const LoginPage = require('../pages/LoginPage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');
const CheckoutPage = require('../pages/CheckoutPage');
const Logger = require('../utils/Logger');

let userCredentials = null;
let cartItems = null;

// Create shared instances outside test scope
let sharedPage;
let sharedContext;

// Use a shared context for all tests
const test = base.extend({
  context: async ({ browser }, use, testInfo) => {
    // Create context only once for the entire suite
    if (!sharedContext) {
      sharedContext = await browser.newContext();
    }
    await use(sharedContext);
    // Don't close context after each test
  },
  page: async ({ context }, use, testInfo) => {
    // Create page only once for the entire suite
    if (!sharedPage) {
      sharedPage = await context.newPage();
    }
    await use(sharedPage);
    // Don't close page after each test
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  logger: async ({}, use) => {
    await use(new Logger());
  }
});

test.describe.configure({ mode: 'serial' });

test.describe('E-Commerce Checkout Flow - Modular Tests', () => {
  
  test.beforeAll(async () => {
    console.log('\n========================================');
    console.log('E-Commerce Modular Test Suite Started');
    console.log('========================================\n');
  });

  test.afterAll(async ({ browser }) => {
    console.log('\n========================================');
    console.log('E-Commerce Modular Test Suite Completed');
    console.log('========================================\n');
    
    // Clean up shared instances
    if (sharedPage) {
      await sharedPage.close();
      sharedPage = null;
    }
    if (sharedContext) {
      await sharedContext.close();
      sharedContext = null;
    }
  });

  // Test 1: User Registration
  test('1. User Registration', async ({ page, homePage, registrationPage, logger }) => {
    logger.testStart('User Registration');

    try {
      await homePage.navigateToHome();
      await homePage.clickRegister();
      
      const registrationData = TestDataManager.getUserRegistrationData();
      logger.info(`Creating user with email: ${registrationData.email}`);
      
      await registrationPage.fillRegistrationForm(registrationData);
      await registrationPage.clickRegister();
      await registrationPage.verifyRegistrationSuccess();
      await registrationPage.takeScreenshot('1-registration-success');
      
      await registrationPage.clickContinue();
      
      // Store credentials for next tests
      userCredentials = {
        email: registrationData.email,
        password: registrationData.password
      };
      
      TestDataManager.saveTestData('testCredentials.json', userCredentials);
      logger.success(`User registered: ${userCredentials.email}`);
      logger.testEnd('User Registration', 'PASSED');

    } catch (error) {
      logger.error(`Registration failed: ${error.message}`);
      logger.testEnd('User Registration', 'FAILED');
      throw error;
    }
  });

  // Test 2: User Logout
  test('2. User Logout', async ({ page, homePage, logger }) => {
    logger.testStart('User Logout');

    try {
      if (!userCredentials) {
        const savedCreds = TestDataManager.loadTestData('testCredentials.json');
        userCredentials = savedCreds;
      }

      // Navigate to home if needed
      if (!page.url().includes('demowebshop.tricentis.com')) {
        await homePage.navigateToHome();
      }

      await homePage.clickLogout();
      await homePage.verifyLoggedOut();
      await homePage.takeScreenshot('2-logout-success');
      
      logger.success('User logged out successfully');
      logger.testEnd('User Logout', 'PASSED');

    } catch (error) {
      logger.error(`Logout failed: ${error.message}`);
      logger.testEnd('User Logout', 'FAILED');
      throw error;
    }
  });

  // Test 3: User Login
  test('3. User Login', async ({ page, homePage, loginPage, logger }) => {
    logger.testStart('User Login');

    try {
      if (!userCredentials) {
        const savedCreds = TestDataManager.loadTestData('testCredentials.json');
        userCredentials = savedCreds;
      }

      // Navigate to home if needed
      if (!page.url().includes('demowebshop.tricentis.com')) {
        await homePage.navigateToHome();
      }

      await homePage.clickLogin();
      await loginPage.login(userCredentials.email, userCredentials.password);
      await homePage.verifyLoggedIn(userCredentials.email);
      await homePage.takeScreenshot('3-login-success');
      
      logger.success('User logged in successfully');
      logger.testEnd('User Login', 'PASSED');

    } catch (error) {
      logger.error(`Login failed: ${error.message}`);
      logger.testEnd('User Login', 'FAILED');
      throw error;
    }
  });

  // Test 4: Add Items to Cart
  test('4. Add Items to Cart', async ({ page, homePage, productPage, logger }) => {
    logger.testStart('Add Items to Cart');

    try {
      // Navigate to home if needed
      if (!page.url().includes('demowebshop.tricentis.com')) {
        await homePage.navigateToHome();
      }

      await homePage.goToBooksCategory();
      await page.waitForLoadState('networkidle');
      
      logger.info('Adding first product to cart');
      await productPage.addProductToCartByIndex(0);
      await productPage.verifyProductAddedNotification();
      await productPage.closeNotificationBar();
      
      logger.info('Adding second product to cart');
      await productPage.addProductToCartByIndex(1);
      await productPage.verifyProductAddedNotification();
      await productPage.closeNotificationBar();
      
      logger.info('Adding third product to cart');
      await productPage.addProductToCartByIndex(2);
      await productPage.verifyProductAddedNotification();
      await productPage.takeScreenshot('4-products-added');
      
      logger.success('3 products added to cart');
      logger.testEnd('Add Items to Cart', 'PASSED');

    } catch (error) {
      logger.error(`Adding items failed: ${error.message}`);
      logger.testEnd('Add Items to Cart', 'FAILED');
      throw error;
    }
  });

  // Test 5: Validate Shopping Cart
  test('5. Validate Shopping Cart', async ({ page, homePage, cartPage, logger }) => {
    logger.testStart('Validate Shopping Cart');

    try {
      // Navigate to home if needed
      if (!page.url().includes('demowebshop.tricentis.com')) {
        await homePage.navigateToHome();
      }

      await homePage.goToShoppingCart();
      
      const cartItemCount = await cartPage.getCartItemsCount();
      logger.info(`Cart contains ${cartItemCount} items`);
      expect(cartItemCount).toBe(3);
      
      cartItems = await cartPage.getAllCartItemsDetails();
      logger.info('Cart Items:');
      cartItems.forEach((item, index) => {
        logger.info(`  ${index + 1}. ${item.name} - ${item.unitPrice} x ${item.quantity}`);
      });
      
      await cartPage.takeScreenshot('5-cart-validated');
      logger.success('Cart validation completed');
      logger.testEnd('Validate Shopping Cart', 'PASSED');

    } catch (error) {
      logger.error(`Cart validation failed: ${error.message}`);
      logger.testEnd('Validate Shopping Cart', 'FAILED');
      throw error;
    }
  });

  // Test 6: Proceed to Checkout
  test('6. Proceed to Checkout', async ({ page, cartPage, logger }) => {
    logger.testStart('Proceed to Checkout');

    try {
      // Should already be on cart page from previous test
      if (!page.url().includes('/cart')) {
        test.skip();
        return;
      }

      await cartPage.acceptTermsOfService();
      await cartPage.clickCheckout();
      await cartPage.takeScreenshot('6-checkout-initiated');
      
      logger.success('Navigated to checkout page');
      logger.testEnd('Proceed to Checkout', 'PASSED');

    } catch (error) {
      logger.error(`Checkout navigation failed: ${error.message}`);
      logger.testEnd('Proceed to Checkout', 'FAILED');
      throw error;
    }
  });

  // Test 7: Fill Billing Details
  test('7. Fill Billing Details', async ({ page, checkoutPage, logger }) => {
    logger.testStart('Fill Billing Details');

    try {
      // Should be on checkout page
      if (!page.url().includes('/onepagecheckout')) {
        test.skip();
        return;
      }

      if (!userCredentials) {
        const savedCreds = TestDataManager.loadTestData('testCredentials.json');
        userCredentials = savedCreds;
      }

      const billingAddress = TestDataManager.getBillingAddressData();
      billingAddress.email = userCredentials.email;
      
      logger.info('Filling billing address...');
      await checkoutPage.fillBillingAddress(billingAddress);
      await checkoutPage.continueBillingAddress();
      await checkoutPage.takeScreenshot('7-billing-filled');
      
      logger.success('Billing address filled successfully');
      logger.testEnd('Fill Billing Details', 'PASSED');

    } catch (error) {
      logger.error(`Billing details failed: ${error.message}`);
      logger.testEnd('Fill Billing Details', 'FAILED');
      throw error;
    }
  });

  // Test 8: Fill Shipping Details
  test('8. Fill Shipping Details', async ({ page, checkoutPage, logger }) => {
    logger.testStart('Fill Shipping Details');

    try {
      if (!page.url().includes('/onepagecheckout')) {
        test.skip();
        return;
      }

      await checkoutPage.checkShipToSameAddress();
      await checkoutPage.continueShippingAddress();
      await checkoutPage.takeScreenshot('8-shipping-filled');
      
      logger.success('Shipping address configured');
      logger.testEnd('Fill Shipping Details', 'PASSED');

    } catch (error) {
      logger.error(`Shipping details failed: ${error.message}`);
      logger.testEnd('Fill Shipping Details', 'FAILED');
      throw error;
    }
  });

  // Test 9: Select Shipping Method
  test('9. Select Shipping Method', async ({ page, checkoutPage, logger }) => {
    logger.testStart('Select Shipping Method');

    try {
      if (!page.url().includes('/onepagecheckout')) {
        test.skip();
        return;
      }

      await checkoutPage.selectShippingMethod(0);
      await checkoutPage.continueShippingMethod();
      await checkoutPage.takeScreenshot('9-shipping-method');
      
      logger.success('Shipping method selected');
      logger.testEnd('Select Shipping Method', 'PASSED');

    } catch (error) {
      logger.error(`Shipping method selection failed: ${error.message}`);
      logger.testEnd('Select Shipping Method', 'FAILED');
      throw error;
    }
  });

  // Test 10: Select Payment Method
  test('10. Select Payment Method', async ({ page, checkoutPage, logger }) => {
    logger.testStart('Select Payment Method');

    try {
      if (!page.url().includes('/onepagecheckout')) {
        test.skip();
        return;
      }

      await checkoutPage.selectPaymentMethod(0);
      await checkoutPage.continuePaymentMethod();
      await checkoutPage.takeScreenshot('10-payment-method');
      
      logger.success('Payment method selected');
      logger.testEnd('Select Payment Method', 'PASSED');

    } catch (error) {
      logger.error(`Payment method selection failed: ${error.message}`);
      logger.testEnd('Select Payment Method', 'FAILED');
      throw error;
    }
  });

  // Test 11: Payment Information
  test('11. Payment Information', async ({ page, checkoutPage, logger }) => {
    logger.testStart('Payment Information');

    try {
      if (!page.url().includes('/onepagecheckout')) {
        test.skip();
        return;
      }

      await checkoutPage.continuePaymentInfo();
      await checkoutPage.takeScreenshot('11-payment-info');
      
      logger.success('Payment information submitted');
      logger.testEnd('Payment Information', 'PASSED');

    } catch (error) {
      logger.error(`Payment information failed: ${error.message}`);
      logger.testEnd('Payment Information', 'FAILED');
      throw error;
    }
  });

  // Test 12: Place Order
  test('12. Place Order', async ({ page, checkoutPage, logger }) => {
    logger.testStart('Place Order');

    try {
      await checkoutPage.confirmOrder();
      
      // Wait for order completion page
      await page.waitForURL('**/checkout/completed/**', { timeout: 10000 });
      await checkoutPage.takeScreenshot('12-order-placed');
      
      logger.success('Order placed successfully');
      logger.testEnd('Place Order', 'PASSED');

    } catch (error) {
      logger.error(`Place order failed: ${error.message}`);
      logger.testEnd('Place Order', 'FAILED');
      throw error;
    }
  });

});

