const { test } = require('../fixtures/testFixtures');
const { expect } = require('@playwright/test');
const TestDataManager = require('../utils/TestDataManager');

let userCredentials = null;

test.describe('E-Commerce Checkout Flow - End to End Tests', () => {
  
  test.beforeAll(async () => {
    console.log('\n========================================');
    console.log('Starting E-Commerce Checkout Test Suite');
    console.log('========================================\n');
  });

  test.afterAll(async () => {
    console.log('\n========================================');
    console.log('E-Commerce Checkout Test Suite Completed');
    console.log('========================================\n');
  });

  test('Complete E2E Checkout Flow - Registration to Order Completion', async ({ 
    page, 
    homePage, 
    registrationPage, 
    loginPage, 
    productPage, 
    cartPage, 
    checkoutPage, 
    logger 
  }) => {
    logger.testStart('Complete E2E Checkout Flow');

    try {
      // ==================== STEP 1: User Registration ====================
      logger.step('Step 1: Navigate to registration page and create new user');
      await homePage.navigateToHome();
      await homePage.clickRegister();
      
      const registrationData = TestDataManager.getUserRegistrationData();
      logger.info(`Creating user with email: ${registrationData.email}`);
      
      await registrationPage.fillRegistrationForm(registrationData);
      await registrationPage.clickRegister();
      await registrationPage.verifyRegistrationSuccess();
      await registrationPage.takeScreenshot('registration-success');
      logger.success('User registration completed successfully');
      
      await registrationPage.clickContinue();
      
      // Store credentials for later use
      userCredentials = {
        email: registrationData.email,
        password: registrationData.password
      };
      
      // Save credentials to file for future reference
      TestDataManager.saveTestData('testCredentials.json', userCredentials);
      logger.info(`Credentials saved for user: ${userCredentials.email}`);

      // ==================== STEP 2: Logout ====================
      logger.step('Step 2: Logout from the application');
      await homePage.clickLogout();
      await homePage.verifyLoggedOut();
      logger.success('User logged out successfully');

      // ==================== STEP 3: Login ====================
      logger.step('Step 3: Login with newly created credentials');
      await homePage.clickLogin();
      await loginPage.login(userCredentials.email, userCredentials.password);
      await homePage.verifyLoggedIn(userCredentials.email);
      await homePage.takeScreenshot('login-success');
      logger.success('User logged in successfully');

      // ==================== STEP 4: Browse and Add Products ====================
      logger.step('Step 4: Navigate to Books category and add products to cart');
      await homePage.goToBooksCategory();
      await page.waitForLoadState('networkidle');
      
      // Add first product
      logger.info('Adding first product to cart');
      await productPage.addProductToCartByIndex(0);
      await productPage.verifyProductAddedNotification();
      await productPage.closeNotificationBar();
      logger.success('First product added to cart');
      
      // Add second product
      logger.info('Adding second product to cart');
      await productPage.addProductToCartByIndex(1);
      await productPage.verifyProductAddedNotification();
      await productPage.closeNotificationBar();
      logger.success('Second product added to cart');

      // Add third product
      logger.info('Adding third product to cart');
      await productPage.addProductToCartByIndex(2);
      await productPage.verifyProductAddedNotification();
      await productPage.takeScreenshot('products-added-to-cart');
      logger.success('Third product added to cart');

      // ==================== STEP 5: Navigate to Cart ====================
      logger.step('Step 5: Navigate to shopping cart and validate items');
      await homePage.goToShoppingCart();
      
      // Verify cart has 3 items
      const cartItemCount = await cartPage.getCartItemsCount();
      logger.info(`Cart contains ${cartItemCount} items`);
      expect(cartItemCount).toBe(3);
      logger.success('Cart item count verified');

      // Get all cart items
      const cartItems = await cartPage.getAllCartItemsDetails();
      logger.info('Cart Items:');
      cartItems.forEach((item, index) => {
        logger.info(`  ${index + 1}. ${item.name} - ${item.unitPrice} x ${item.quantity} = ${item.subtotal}`);
      });

      // Take screenshot of cart
      await cartPage.takeScreenshot('cart-summary');
      logger.success('Cart validation completed');

      // ==================== STEP 6: Proceed to Checkout ====================
      logger.step('Step 6: Accept terms and proceed to checkout');
      await cartPage.acceptTermsOfService();
      await cartPage.clickCheckout();
      logger.success('Navigated to checkout page');

      // ==================== STEP 7: Fill Checkout Details ====================
      logger.step('Step 7: Fill billing and shipping address');
      
      const billingAddress = TestDataManager.getBillingAddressData();
      billingAddress.email = userCredentials.email;
      
      logger.info('Filling billing address...');
      await checkoutPage.fillBillingAddress(billingAddress);
      await checkoutPage.continueBillingAddress();
      logger.success('Billing address filled and submitted');

      logger.info('Using same address for shipping...');
      await checkoutPage.checkShipToSameAddress();
      await checkoutPage.continueShippingAddress();
      logger.success('Shipping address configured');

      // ==================== STEP 8: Select Shipping Method ====================
      logger.step('Step 8: Select shipping method');
      await checkoutPage.selectShippingMethod(0);
      await checkoutPage.continueShippingMethod();
      await checkoutPage.takeScreenshot('shipping-method-selected');
      logger.success('Shipping method selected');

      // ==================== STEP 9: Select Payment Method ====================
      logger.step('Step 9: Select payment method');
      await checkoutPage.selectPaymentMethod(0);
      await checkoutPage.continuePaymentMethod();
      logger.success('Payment method selected');

      // ==================== STEP 10: Payment Information ====================
      logger.step('Step 10: Continue with payment information');
      await checkoutPage.continuePaymentInfo();
      await checkoutPage.takeScreenshot('payment-info-completed');
      logger.success('Payment information submitted');

      // ==================== STEP 11: Confirm Order ====================
      logger.step('Step 11: Confirm and submit order');
      await checkoutPage.confirmOrder();
      logger.success('Order confirmation submitted');

      // ==================== STEP 12: Verify Order Completion ====================
      logger.step('Step 12: Verify order completion and get order number');
      await checkoutPage.verifyOrderCompletion();
      
      const orderNumber = await checkoutPage.getOrderNumber();
      logger.info(`Order Number: ${orderNumber}`);
      expect(orderNumber).toBeTruthy();
      
      const successMessage = await checkoutPage.getOrderSuccessMessage();
      logger.info(`Success Message: ${successMessage}`);
      
      await checkoutPage.takeScreenshot('order-confirmation');
      logger.success(`Order completed successfully with Order Number: ${orderNumber}`);

      // Save order details
      const orderDetails = {
        orderNumber: orderNumber,
        email: userCredentials.email,
        orderDate: new Date().toISOString(),
        items: cartItems
      };
      TestDataManager.saveTestData('lastOrderDetails.json', orderDetails);
      logger.info('Order details saved to file');

      logger.testEnd('Complete E2E Checkout Flow', 'PASSED');

    } catch (error) {
      logger.error(`Test failed with error: ${error.message}`);
      await page.screenshot({ path: `screenshots/error-${Date.now()}.png`, fullPage: true });
      logger.testEnd('Complete E2E Checkout Flow', 'FAILED');
      throw error;
    }
  });

  test('Verify Cart Operations - Add, Update, Remove Items', async ({ 
    page, 
    homePage, 
    loginPage, 
    productPage, 
    cartPage, 
    logger 
  }) => {
    logger.testStart('Cart Operations Test');

    try {
      // Login with existing user
      if (!userCredentials) {
        logger.warn('No user credentials found, skipping test');
        test.skip();
        return;
      }

      logger.step('Login to application');
      await homePage.navigateToHome();
      await homePage.clickLogin();
      await loginPage.login(userCredentials.email, userCredentials.password);
      logger.success('Logged in successfully');

      // Add products to cart
      logger.step('Add products to cart');
      await homePage.goToBooksCategory();
      await productPage.addProductToCartByIndex(0);
      await productPage.closeNotificationBar();
      await productPage.addProductToCartByIndex(1);
      await productPage.closeNotificationBar();
      logger.success('Products added to cart');

      // Navigate to cart
      await homePage.goToShoppingCart();
      let itemCount = await cartPage.getCartItemsCount();
      logger.info(`Initial cart items: ${itemCount}`);
      expect(itemCount).toBeGreaterThan(0);

      // Update quantity
      logger.step('Update item quantity');
      await cartPage.updateItemQuantity(0, 2);
      const updatedItem = await cartPage.getCartItemByIndex(0);
      expect(updatedItem.quantity).toBe(2);
      await cartPage.takeScreenshot('cart-quantity-updated');
      logger.success('Item quantity updated successfully');

      // Remove item
      logger.step('Remove item from cart');
      const itemCountBefore = await cartPage.getCartItemsCount();
      await cartPage.removeItemByIndex(0);
      const itemCountAfter = await cartPage.getCartItemsCount();
      expect(itemCountAfter).toBe(itemCountBefore - 1);
      await cartPage.takeScreenshot('cart-item-removed');
      logger.success('Item removed from cart successfully');

      logger.testEnd('Cart Operations Test', 'PASSED');

    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      logger.testEnd('Cart Operations Test', 'FAILED');
      throw error;
    }
  });

  test('Verify Product Search Functionality', async ({ 
    page, 
    homePage, 
    loginPage, 
    productPage, 
    logger 
  }) => {
    logger.testStart('Product Search Test');

    try {
      // Login
      if (!userCredentials) {
        logger.warn('No user credentials found, skipping test');
        test.skip();
        return;
      }

      logger.step('Login to application');
      await homePage.navigateToHome();
      await homePage.clickLogin();
      await loginPage.login(userCredentials.email, userCredentials.password);
      logger.success('Logged in successfully');

      // Search for product
      logger.step('Search for product');
      const searchTerm = 'book';
      await homePage.searchProduct(searchTerm);
      await page.waitForLoadState('networkidle');
      
      const productCount = await productPage.getProductCount();
      logger.info(`Found ${productCount} products for search term: ${searchTerm}`);
      expect(productCount).toBeGreaterThan(0);
      
      await productPage.takeScreenshot('search-results');
      logger.success('Product search completed successfully');

      logger.testEnd('Product Search Test', 'PASSED');

    } catch (error) {
      logger.error(`Test failed: ${error.message}`);
      logger.testEnd('Product Search Test', 'FAILED');
      throw error;
    }
  });

});

