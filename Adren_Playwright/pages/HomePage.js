const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.registerLink = "//a[@class='ico-register']";
    this.loginLink = "//a[@class='ico-login']";
    this.logoutLink = "//a[@class='ico-logout']";
    this.searchInput = "#small-searchterms";
    this.searchButton = "//input[@type='submit' and @value='Search']";
    this.shoppingCartLink = "//a[@class='ico-cart']//span[@class='cart-label']";
    this.cartQuantity = "//a[@class='ico-cart']//span[@class='cart-qty']";
    this.accountLink = "//a[@class='account']";
    
    // Product categories
    this.booksCategory = "//a[contains(@href, '/books')]";
    this.computersCategory = "//a[contains(@href, '/computers')]";
    this.electronicsCategory = "//a[contains(@href, '/electronics')]";
    
    // Featured products
    this.featuredProducts = ".product-item";
    this.addToCartButtons = "//input[@value='Add to cart']";
  }

  /**
   * Navigate to home page
   */
  async navigateToHome() {
    await this.goto('/');
    await this.waitForPageLoad();
  }

  /**
   * Click on Register link
   */
  async clickRegister() {
    await this.click(this.registerLink);
  }

  /**
   * Click on Login link
   */
  async clickLogin() {
    await this.click(this.loginLink);
  }

  /**
   * Click on Logout link
   */
  async clickLogout() {
    await this.click(this.logoutLink);
    await this.waitForPageLoad();
  }

  /**
   * Search for a product
   * @param {string} productName - Product name to search
   */
  async searchProduct(productName) {
    await this.fill(this.searchInput, productName);
    await this.click(this.searchButton);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to shopping cart
   */
  async goToShoppingCart() {
    await this.click(this.shoppingCartLink);
    await this.waitForPageLoad();
  }

  /**
   * Get cart item count
   * @returns {Promise<number>} Number of items in cart
   */
  async getCartItemCount() {
    const cartText = await this.getText(this.cartQuantity);
    const match = cartText.match(/\((\d+)\)/);
    return match ? parseInt(match[1]) : 0;
  }

  /**
   * Verify user is logged in
   * @param {string} email - User email
   */
  async verifyLoggedIn(email) {
    const accountText = await this.page.locator(this.accountLink).first().textContent();
    expect(accountText).toContain(email);
  }

  /**
   * Verify user is logged out
   */
  async verifyLoggedOut() {
    const isLoginVisible = await this.isVisible(this.loginLink);
    expect(isLoginVisible).toBeTruthy();
  }

  /**
   * Click on Books category
   */
  async goToBooksCategory() {
    await this.page.locator(this.booksCategory).first().click();
    await this.waitForPageLoad();
  }

  /**
   * Click on Computers category
   */
  async goToComputersCategory() {
    await this.page.locator(this.computersCategory).first().click();
    await this.waitForPageLoad();
  }

  /**
   * Click on Electronics category
   */
  async goToElectronicsCategory() {
    await this.page.locator(this.electronicsCategory).first().click();
    await this.waitForPageLoad();
  }

  /**
   * Add featured product to cart by index
   * @param {number} index - Product index (0-based)
   */
  async addFeaturedProductToCart(index) {
    const products = this.page.locator(this.featuredProducts);
    const product = products.nth(index);
    await product.locator("input[value='Add to cart']").click();
    await this.waitForPageLoad();
  }
}

module.exports = HomePage;

