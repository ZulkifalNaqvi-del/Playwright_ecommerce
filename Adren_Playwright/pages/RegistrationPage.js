const BasePage = require('./BasePage');
const { expect } = require('@playwright/test');

class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Locators
    this.genderMale = "#gender-male";
    this.genderFemale = "#gender-female";
    this.firstNameInput = "#FirstName";
    this.lastNameInput = "#LastName";
    this.emailInput = "#Email";
    this.passwordInput = "#Password";
    this.confirmPasswordInput = "#ConfirmPassword";
    this.registerButton = "#register-button";
    this.successMessage = "//div[@class='result']";
    this.continueButton = "//input[@value='Continue']";
    this.errorMessage = ".validation-summary-errors";
    
    // Field validation messages
    this.firstNameError = "//span[@data-valmsg-for='FirstName']";
    this.lastNameError = "//span[@data-valmsg-for='LastName']";
    this.emailError = "//span[@data-valmsg-for='Email']";
    this.passwordError = "//span[@data-valmsg-for='Password']";
    this.confirmPasswordError = "//span[@data-valmsg-for='ConfirmPassword']";
  }

  /**
   * Navigate to registration page
   */
  async navigateToRegistration() {
    await this.goto('/register');
    await this.waitForPageLoad();
  }

  /**
   * Select gender
   * @param {string} gender - 'M' for male, 'F' for female
   */
  async selectGender(gender) {
    if (gender.toUpperCase() === 'M') {
      await this.click(this.genderMale);
    } else {
      await this.click(this.genderFemale);
    }
  }

  /**
   * Fill registration form
   * @param {Object} userData - User registration data
   */
  async fillRegistrationForm(userData) {
    // Select gender
    await this.selectGender(userData.gender);
    
    // Fill form fields
    await this.fill(this.firstNameInput, userData.firstName);
    await this.fill(this.lastNameInput, userData.lastName);
    await this.fill(this.emailInput, userData.email);
    await this.fill(this.passwordInput, userData.password);
    await this.fill(this.confirmPasswordInput, userData.confirmPassword);
  }

  /**
   * Click register button
   */
  async clickRegister() {
    await this.click(this.registerButton);
    await this.waitForPageLoad();
  }

  /**
   * Complete registration process
   * @param {Object} userData - User registration data
   * @returns {Object} User credentials
   */
  async registerUser(userData) {
    await this.fillRegistrationForm(userData);
    await this.clickRegister();
    
    // Wait for success message
    await this.waitForElement(this.successMessage);
    
    return {
      email: userData.email,
      password: userData.password
    };
  }

  /**
   * Verify registration success
   */
  async verifyRegistrationSuccess() {
    const message = await this.getText(this.successMessage);
    expect(message).toContain('Your registration completed');
  }

  /**
   * Click continue button after registration
   */
  async clickContinue() {
    await this.click(this.continueButton);
    await this.waitForPageLoad();
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

  /**
   * Complete registration and continue
   * @param {Object} userData - User registration data
   * @returns {Object} User credentials
   */
  async completeRegistration(userData) {
    const credentials = await this.registerUser(userData);
    await this.verifyRegistrationSuccess();
    await this.clickContinue();
    return credentials;
  }
}

module.exports = RegistrationPage;

