const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.productGrid = ".product-grid";
    this.productItems = ".product-item";
    this.productTitle = ".product-title";
    this.productPrice = ".actual-price";
    this.addToCartButton = "//input[@value='Add to cart']";
    this.addToWishlistButton = "//input[@value='Add to wishlist']";
    this.successNotification = "#bar-notification";
    this.notificationText = ".content";
    this.closeNotification = ".close";
    
    // Product details page
    this.productName = ".product-name h1";
    this.productPriceDetail = ".product-price span";
    this.quantityInput = ".qty-input";
    this.addToCartButtonDetail = "#add-to-cart-button-{0}";
  }

  /**
   * Get all products on the page
   * @returns {Promise<Array>} Array of product elements
   */
  async getAllProducts() {
    return await this.page.locator(this.productItems).all();
  }

  /**
   * Get product count
   * @returns {Promise<number>} Number of products on page
   */
  async getProductCount() {
    return await this.page.locator(this.productItems).count();
  }

  /**
   * Click on product by index
   * @param {number} index - Product index (0-based)
   */
  async clickProductByIndex(index) {
    const products = await this.getAllProducts();
    await products[index].locator(this.productTitle).click();
    await this.waitForPageLoad();
  }

  /**
   * Click on product by name
   * @param {string} productName - Product name
   */
  async clickProductByName(productName) {
    const productLink = `//a[contains(text(), '${productName}')]`;
    await this.click(productLink);
    await this.waitForPageLoad();
  }

  /**
   * Add product to cart from listing page
   * @param {number} index - Product index (0-based)
   */
  async addProductToCartByIndex(index) {
    // Find all visible "Add to cart" buttons
    const addToCartButtons = this.page.locator("input[value='Add to cart']");
    await addToCartButtons.nth(index).click();
    await this.waitForElement(this.successNotification);
    await this.wait(1000); // Wait for animation
  }

  /**
   * Add product to cart by name
   * @param {string} productName - Product name
   */
  async addProductToCartByName(productName) {
    // Find the product and click add to cart
    const productXPath = `//div[@class='product-item']//a[contains(text(), '${productName}')]/ancestor::div[@class='product-item']//input[@value='Add to cart']`;
    await this.click(productXPath);
    await this.waitForElement(this.successNotification);
    await this.wait(1000);
  }

  /**
   * Get product price by index
   * @param {number} index - Product index (0-based)
   * @returns {Promise<string>} Product price
   */
  async getProductPrice(index) {
    const products = await this.getAllProducts();
    const priceElement = products[index].locator(this.productPrice);
    return await priceElement.textContent();
  }

  /**
   * Get product name by index
   * @param {number} index - Product index (0-based)
   * @returns {Promise<string>} Product name
   */
  async getProductName(index) {
    const products = await this.getAllProducts();
    const nameElement = products[index].locator(this.productTitle);
    return await nameElement.textContent();
  }

  /**
   * Close notification bar
   */
  async closeNotificationBar() {
    const isVisible = await this.isVisible(this.closeNotification);
    if (isVisible) {
      await this.click(this.closeNotification);
      await this.wait(500);
    }
  }

  /**
   * Verify product added to cart notification
   */
  async verifyProductAddedNotification() {
    await this.waitForElement(this.successNotification);
    const notificationContent = await this.getText(this.notificationText);
    expect(notificationContent).toContain('The product has been added to your');
  }

  /**
   * Set product quantity and add to cart (detail page)
   * @param {number} quantity - Product quantity
   */
  async addToCartWithQuantity(quantity) {
    await this.fill(this.quantityInput, quantity.toString());
    
    // Find the add to cart button on detail page
    const addToCartBtn = this.page.locator("input[id^='add-to-cart-button-']").first();
    await addToCartBtn.click();
    await this.waitForElement(this.successNotification);
    await this.wait(1000);
  }

  /**
   * Get product details from detail page
   * @returns {Promise<Object>} Product details
   */
  async getProductDetails() {
    const name = await this.getText(this.productName);
    const price = await this.getText(this.productPriceDetail);
    
    return {
      name: name.trim(),
      price: price.trim()
    };
  }
}

module.exports = ProductPage;

