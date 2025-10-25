const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.cartItems = ".cart-item-row";
    this.productName = ".product-name";
    this.unitPrice = ".product-unit-price";
    this.quantity = ".qty-input";
    this.subtotal = ".product-subtotal";
    this.removeCheckbox = ".remove-from-cart input[type='checkbox']";
    this.updateCartButton = "//input[@name='updatecart']";
    this.continueShoppingButton = "//input[@name='continueshopping']";
    this.checkoutButton = "#checkout";
    this.emptyCartMessage = ".order-summary-content";
    
    // Cart totals
    this.cartTotal = ".cart-total-right";
    this.orderTotalRow = ".order-total";
    this.orderTotalAmount = ".order-total .product-price";
    
    // Terms of service
    this.termsOfServiceCheckbox = "#termsofservice";
    this.termsErrorMessage = ".terms-error";
  }

  /**
   * Navigate to cart page
   */
  async navigateToCart() {
    await this.goto('/cart');
    await this.waitForPageLoad();
  }

  /**
   * Get cart items count
   * @returns {Promise<number>} Number of items in cart
   */
  async getCartItemsCount() {
    return await this.page.locator(this.cartItems).count();
  }

  /**
   * Get all cart items details
   * @returns {Promise<Array>} Array of cart item details
   */
  async getAllCartItemsDetails() {
    const itemsCount = await this.getCartItemsCount();
    const items = [];
    
    for (let i = 0; i < itemsCount; i++) {
      const itemRow = this.page.locator(this.cartItems).nth(i);
      const name = await itemRow.locator(this.productName).textContent();
      const price = await itemRow.locator(this.unitPrice).textContent();
      const quantity = await itemRow.locator(this.quantity).inputValue();
      const subtotal = await itemRow.locator(this.subtotal).textContent();
      
      items.push({
        name: name.trim(),
        unitPrice: price.trim(),
        quantity: parseInt(quantity),
        subtotal: subtotal.trim()
      });
    }
    
    return items;
  }

  /**
   * Get cart item by index
   * @param {number} index - Item index (0-based)
   * @returns {Promise<Object>} Cart item details
   */
  async getCartItemByIndex(index) {
    const itemRow = this.page.locator(this.cartItems).nth(index);
    const name = await itemRow.locator(this.productName).textContent();
    const price = await itemRow.locator(this.unitPrice).textContent();
    const quantity = await itemRow.locator(this.quantity).inputValue();
    const subtotal = await itemRow.locator(this.subtotal).textContent();
    
    return {
      name: name.trim(),
      unitPrice: price.trim(),
      quantity: parseInt(quantity),
      subtotal: subtotal.trim()
    };
  }

  /**
   * Update item quantity
   * @param {number} index - Item index (0-based)
   * @param {number} quantity - New quantity
   */
  async updateItemQuantity(index, quantity) {
    const itemRow = this.page.locator(this.cartItems).nth(index);
    await itemRow.locator(this.quantity).fill(quantity.toString());
    await this.click(this.updateCartButton);
    await this.waitForPageLoad();
  }

  /**
   * Remove item from cart
   * @param {number} index - Item index (0-based)
   */
  async removeItemByIndex(index) {
    const itemRow = this.page.locator(this.cartItems).nth(index);
    await itemRow.locator(this.removeCheckbox).check();
    await this.click(this.updateCartButton);
    await this.waitForPageLoad();
  }

  /**
   * Get order total amount
   * @returns {Promise<string>} Order total
   */
  async getOrderTotal() {
    const totalText = await this.getText(this.orderTotalAmount);
    return totalText.trim();
  }

  /**
   * Verify cart item count
   * @param {number} expectedCount - Expected number of items
   */
  async verifyCartItemCount(expectedCount) {
    const actualCount = await this.getCartItemsCount();
    expect(actualCount).toBe(expectedCount);
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty() {
    const messageText = await this.getText(this.emptyCartMessage);
    expect(messageText).toContain('Your Shopping Cart is empty!');
  }

  /**
   * Check terms of service
   */
  async acceptTermsOfService() {
    await this.click(this.termsOfServiceCheckbox);
  }

  /**
   * Click checkout button
   */
  async clickCheckout() {
    await this.click(this.checkoutButton);
    await this.waitForPageLoad();
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    await this.acceptTermsOfService();
    await this.clickCheckout();
  }

  /**
   * Continue shopping
   */
  async continueShopping() {
    await this.click(this.continueShoppingButton);
    await this.waitForPageLoad();
  }

  /**
   * Calculate expected total from items
   * @returns {Promise<number>} Calculated total
   */
  async calculateExpectedTotal() {
    const items = await this.getAllCartItemsDetails();
    let total = 0;
    
    for (const item of items) {
      const subtotalValue = parseFloat(item.subtotal.replace(/[^0-9.]/g, ''));
      total += subtotalValue;
    }
    
    return total;
  }

  /**
   * Verify order total matches expected
   */
  async verifyOrderTotal() {
    const displayedTotal = await this.getOrderTotal();
    const displayedValue = parseFloat(displayedTotal.replace(/[^0-9.]/g, ''));
    const calculatedTotal = await this.calculateExpectedTotal();
    
    expect(displayedValue).toBe(calculatedTotal);
  }
}

module.exports = CartPage;

