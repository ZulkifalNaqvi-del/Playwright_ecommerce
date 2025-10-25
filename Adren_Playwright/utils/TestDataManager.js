const fs = require('fs');
const path = require('path');

class TestDataManager {
  /**
   * Load test data from JSON file
   * @param {string} fileName - JSON file name
   * @returns {Object} Test data
   */
  static loadTestData(fileName) {
    const filePath = path.join(process.cwd(), 'testData', fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Test data file not found: ${filePath}`);
    }
    
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  }

  /**
   * Generate unique email
   * @param {string} prefix - Email prefix
   * @returns {string} Unique email address
   */
  static generateUniqueEmail(prefix = 'testuser') {
    const timestamp = Date.now();
    return `${prefix}_${timestamp}@example.com`;
  }

  /**
   * Generate random string
   * @param {number} length - String length
   * @returns {string} Random string
   */
  static generateRandomString(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate random number
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  static generateRandomNumber(min = 1, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get user registration data with unique email
   * @returns {Object} Registration data
   */
  static getUserRegistrationData() {
    const userData = this.loadTestData('userData.json');
    userData.registrationData.email = this.generateUniqueEmail('testuser');
    userData.registrationData.confirmPassword = userData.registrationData.password;
    return userData.registrationData;
  }

  /**
   * Get shipping address data
   * @returns {Object} Shipping address data
   */
  static getShippingAddressData() {
    const userData = this.loadTestData('userData.json');
    return userData.shippingAddress;
  }

  /**
   * Get billing address data
   * @returns {Object} Billing address data
   */
  static getBillingAddressData() {
    const userData = this.loadTestData('userData.json');
    return userData.billingAddress;
  }

  /**
   * Get products data
   * @returns {Array} Products array
   */
  static getProductsData() {
    const userData = this.loadTestData('userData.json');
    return userData.products;
  }

  /**
   * Save test data to JSON file
   * @param {string} fileName - JSON file name
   * @param {Object} data - Data to save
   */
  static saveTestData(fileName, data) {
    const filePath = path.join(process.cwd(), 'testData', fileName);
    const dirPath = path.dirname(filePath);
    
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  /**
   * Get current timestamp string
   * @returns {string} Timestamp string
   */
  static getTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
  }
}

module.exports = TestDataManager;

