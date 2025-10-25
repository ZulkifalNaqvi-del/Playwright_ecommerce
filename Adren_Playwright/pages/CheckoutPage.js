const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Billing Address Locators
    this.billingAddressDropdown = "#billing-address-select";
    this.billingFirstName = "#BillingNewAddress_FirstName";
    this.billingLastName = "#BillingNewAddress_LastName";
    this.billingEmail = "#BillingNewAddress_Email";
    this.billingCompany = "#BillingNewAddress_Company";
    this.billingCountry = "#BillingNewAddress_CountryId";
    this.billingCity = "#BillingNewAddress_City";
    this.billingAddress1 = "#BillingNewAddress_Address1";
    this.billingAddress2 = "#BillingNewAddress_Address2";
    this.billingZipCode = "#BillingNewAddress_ZipPostalCode";
    this.billingPhone = "#BillingNewAddress_PhoneNumber";
    this.billingContinueButton = "//input[@onclick='Billing.save()']";
    
    // Shipping Address Locators
    this.shippingAddressDropdown = "#shipping-address-select";
    this.shipToSameAddressCheckbox = "#ShipToSameAddress";
    this.shippingFirstName = "#ShippingNewAddress_FirstName";
    this.shippingLastName = "#ShippingNewAddress_LastName";
    this.shippingEmail = "#ShippingNewAddress_Email";
    this.shippingCompany = "#ShippingNewAddress_Company";
    this.shippingCountry = "#ShippingNewAddress_CountryId";
    this.shippingCity = "#ShippingNewAddress_City";
    this.shippingAddress1 = "#ShippingNewAddress_Address1";
    this.shippingAddress2 = "#ShippingNewAddress_Address2";
    this.shippingZipCode = "#ShippingNewAddress_ZipPostalCode";
    this.shippingPhone = "#ShippingNewAddress_PhoneNumber";
    this.shippingContinueButton = "//input[@onclick='Shipping.save()']";
    
    // Shipping Method Locators
    this.shippingMethodOptions = "//input[@name='shippingoption']";
    this.shippingMethodContinue = "//input[@onclick='ShippingMethod.save()']";
    
    // Payment Method Locators
    this.paymentMethodOptions = "//input[@name='paymentmethod']";
    this.paymentMethodContinue = "//input[@onclick='PaymentMethod.save()']";
    
    // Payment Information Locators
    this.paymentInfoContinue = "//input[@onclick='PaymentInfo.save()']";
    
    // Confirm Order Locators
    this.confirmOrderButton = "//input[@onclick='ConfirmOrder.save()']";
    this.orderDetails = ".order-details";
    this.orderNumber = ".order-number";
    
    // Order Completed
    this.orderCompletedTitle = ".order-completed .title";
    this.orderSuccessMessage = ".order-completed .details";
    this.orderNumberDisplay = ".order-number strong";
    this.continueButton = "//input[@value='Continue']";
  }

  /**
   * Navigate to checkout page
   */
  async navigateToCheckout() {
    await this.goto('/onepagecheckout');
    await this.waitForPageLoad();
  }

  /**
   * Fill billing address
   * @param {Object} addressData - Billing address data
   */
  async fillBillingAddress(addressData) {
    // Select 'New Address' from dropdown if exists
    const dropdownExists = await this.elementExists(this.billingAddressDropdown);
    if (dropdownExists) {
      await this.selectByText(this.billingAddressDropdown, 'New Address');
      await this.wait(1000);
    }
    
    await this.fill(this.billingFirstName, addressData.firstName);
    await this.fill(this.billingLastName, addressData.lastName);
    await this.fill(this.billingEmail, addressData.email);
    
    if (addressData.company) {
      await this.fill(this.billingCompany, addressData.company);
    }
    
    await this.selectByText(this.billingCountry, addressData.country);
    await this.wait(500); // Wait for country selection to process
    
    await this.fill(this.billingCity, addressData.city);
    await this.fill(this.billingAddress1, addressData.address1);
    
    if (addressData.address2) {
      await this.fill(this.billingAddress2, addressData.address2);
    }
    
    await this.fill(this.billingZipCode, addressData.zipCode);
    await this.fill(this.billingPhone, addressData.phone);
  }

  /**
   * Continue from billing address step
   */
  async continueBillingAddress() {
    await this.click(this.billingContinueButton);
    await this.waitForPageLoad();
    await this.wait(2000); // Wait for next section to load
  }

  /**
   * Check ship to same address
   */
  async checkShipToSameAddress() {
    // Check if the checkbox exists first
    const checkboxExists = await this.elementExists(this.shipToSameAddressCheckbox);
    if (checkboxExists) {
      const isChecked = await this.page.locator(this.shipToSameAddressCheckbox).isChecked();
      if (!isChecked) {
        await this.click(this.shipToSameAddressCheckbox);
        await this.wait(1000);
      }
    }
  }

  /**
   * Fill shipping address
   * @param {Object} addressData - Shipping address data
   */
  async fillShippingAddress(addressData) {
    // Select 'New Address' from dropdown if exists
    const dropdownExists = await this.elementExists(this.shippingAddressDropdown);
    if (dropdownExists) {
      await this.selectByText(this.shippingAddressDropdown, 'New Address');
      await this.wait(1000);
    }
    
    await this.fill(this.shippingFirstName, addressData.firstName);
    await this.fill(this.shippingLastName, addressData.lastName);
    await this.fill(this.shippingEmail, addressData.email);
    
    if (addressData.company) {
      await this.fill(this.shippingCompany, addressData.company);
    }
    
    await this.selectByText(this.shippingCountry, addressData.country);
    await this.wait(500);
    
    await this.fill(this.shippingCity, addressData.city);
    await this.fill(this.shippingAddress1, addressData.address1);
    
    if (addressData.address2) {
      await this.fill(this.shippingAddress2, addressData.address2);
    }
    
    await this.fill(this.shippingZipCode, addressData.zipCode);
    await this.fill(this.shippingPhone, addressData.phone);
  }

  /**
   * Continue from shipping address step
   */
  async continueShippingAddress() {
    await this.click(this.shippingContinueButton);
    await this.waitForPageLoad();
    await this.wait(2000);
  }

  /**
   * Select shipping method
   * @param {number} index - Shipping method index (0-based), defaults to first option
   */
  async selectShippingMethod(index = 0) {
    const shippingOptions = this.page.locator(this.shippingMethodOptions);
    const optionsCount = await shippingOptions.count();
    
    if (optionsCount > 0) {
      await shippingOptions.nth(index).check();
    }
  }

  /**
   * Continue from shipping method step
   */
  async continueShippingMethod() {
    await this.click(this.shippingMethodContinue);
    await this.waitForPageLoad();
    await this.wait(2000);
  }

  /**
   * Select payment method
   * @param {number} index - Payment method index (0-based), defaults to first option
   */
  async selectPaymentMethod(index = 0) {
    const paymentOptions = this.page.locator(this.paymentMethodOptions);
    await paymentOptions.nth(index).check();
    await this.wait(500);
  }

  /**
   * Continue from payment method step
   */
  async continuePaymentMethod() {
    await this.click(this.paymentMethodContinue);
    await this.waitForPageLoad();
    await this.wait(2000);
  }

  /**
   * Continue from payment information step
   */
  async continuePaymentInfo() {
    await this.click(this.paymentInfoContinue);
    await this.waitForPageLoad();
    await this.wait(2000);
  }

  /**
   * Confirm order
   */
  async confirmOrder() {
    await this.click(this.confirmOrderButton);
    await this.waitForPageLoad();
    await this.wait(2000);
  }

  /**
   * Complete checkout process
   * @param {Object} billingAddress - Billing address data
   * @param {Object} shippingAddress - Shipping address data (optional)
   * @param {boolean} sameAddress - Use same address for shipping
   */
  async completeCheckout(billingAddress, shippingAddress = null, sameAddress = true) {
    // Step 1: Billing Address
    await this.fillBillingAddress(billingAddress);
    await this.continueBillingAddress();
    
    // Step 2: Shipping Address
    if (sameAddress) {
      await this.checkShipToSameAddress();
    } else if (shippingAddress) {
      await this.fillShippingAddress(shippingAddress);
    }
    await this.continueShippingAddress();
    
    // Step 3: Shipping Method
    await this.selectShippingMethod(0);
    await this.continueShippingMethod();
    
    // Step 4: Payment Method
    await this.selectPaymentMethod(0);
    await this.continuePaymentMethod();
    
    // Step 5: Payment Information
    await this.continuePaymentInfo();
    
    // Step 6: Confirm Order
    await this.confirmOrder();
  }

  /**
   * Get order number from confirmation page
   * @returns {Promise<string>} Order number
   */
  async getOrderNumber() {
    await this.waitForElement(this.orderNumberDisplay);
    const orderText = await this.getText(this.orderNumberDisplay);
    return orderText.trim();
  }

  /**
   * Verify order completion
   */
  async verifyOrderCompletion() {
    await this.waitForElement(this.orderCompletedTitle);
    const titleText = await this.getText(this.orderCompletedTitle);
    expect(titleText).toContain('Your order has been successfully processed!');
  }

  /**
   * Get order success message
   * @returns {Promise<string>} Success message
   */
  async getOrderSuccessMessage() {
    const message = await this.getText(this.orderSuccessMessage);
    return message.trim();
  }

  /**
   * Click continue after order completion
   */
  async clickContinueAfterOrder() {
    await this.click(this.continueButton);
    await this.waitForPageLoad();
  }
}

module.exports = CheckoutPage;

