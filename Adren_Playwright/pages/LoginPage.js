const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.emailInput = "#Email";
    this.passwordInput = "#Password";
    this.rememberMeCheckbox = "#RememberMe";
    this.loginButton = "//input[@value='Log in']";
    this.errorMessage = ".validation-summary-errors";
    this.forgotPasswordLink = "//a[contains(text(), 'Forgot password?')]";
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin() {
    await this.goto('/login');
    await this.waitForPageLoad();
  }

  /**
   * Fill login credentials
   * @param {string} email - User email
   * @param {string} password - User password
   */
  async fillLoginCredentials(email, password) {
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLogin() {
    await this.click(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Check remember me checkbox
   */
  async checkRememberMe() {
    await this.click(this.rememberMeCheckbox);
  }

  /**
   * Perform login
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to check remember me
   */
  async login(email, password, rememberMe = false) {
    await this.fillLoginCredentials(email, password);
    
    if (rememberMe) {
      await this.checkRememberMe();
    }
    
    await this.clickLogin();
  }

  /**
   * Verify login error
   */
  async verifyLoginError() {
    const isVisible = await this.isVisible(this.errorMessage);
    expect(isVisible).toBeTruthy();
  }

  /**
   * Get error message
   * @returns {Promise<string>} Error message text
   */
  async getErrorMessage() {
    const isVisible = await this.isVisible(this.errorMessage);
    if (isVisible) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }
}

module.exports = LoginPage;

