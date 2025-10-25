const fs = require('fs');
const path = require('path');

class Logger {
  constructor(logFileName = 'test-execution.log') {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFilePath = path.join(this.logDir, logFileName);
    this.ensureLogDirectory();
  }

  /**
   * Ensure log directory exists
   */
  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * Get current timestamp
   * @returns {string} Formatted timestamp
   */
  getTimestamp() {
    const now = new Date();
    return now.toISOString();
  }

  /**
   * Format log message
   * @param {string} level - Log level
   * @param {string} message - Log message
   * @returns {string} Formatted log message
   */
  formatMessage(level, message) {
    return `[${this.getTimestamp()}] [${level}] ${message}\n`;
  }

  /**
   * Write log to file
   * @param {string} level - Log level
   * @param {string} message - Log message
   */
  writeLog(level, message) {
    const formattedMessage = this.formatMessage(level, message);
    fs.appendFileSync(this.logFilePath, formattedMessage, 'utf-8');
  }

  /**
   * Log info message
   * @param {string} message - Log message
   */
  info(message) {
    console.log(`ℹ️  INFO: ${message}`);
    this.writeLog('INFO', message);
  }

  /**
   * Log success message
   * @param {string} message - Log message
   */
  success(message) {
    console.log(`✅ SUCCESS: ${message}`);
    this.writeLog('SUCCESS', message);
  }

  /**
   * Log warning message
   * @param {string} message - Log message
   */
  warn(message) {
    console.warn(`⚠️  WARNING: ${message}`);
    this.writeLog('WARNING', message);
  }

  /**
   * Log error message
   * @param {string} message - Log message
   */
  error(message) {
    console.error(`❌ ERROR: ${message}`);
    this.writeLog('ERROR', message);
  }

  /**
   * Log debug message
   * @param {string} message - Log message
   */
  debug(message) {
    console.log(`🔍 DEBUG: ${message}`);
    this.writeLog('DEBUG', message);
  }

  /**
   * Log test start
   * @param {string} testName - Test name
   */
  testStart(testName) {
    const message = `========== TEST STARTED: ${testName} ==========`;
    console.log(`\n${message}\n`);
    this.writeLog('TEST', message);
  }

  /**
   * Log test end
   * @param {string} testName - Test name
   * @param {string} status - Test status (PASSED/FAILED)
   */
  testEnd(testName, status) {
    const message = `========== TEST ${status}: ${testName} ==========`;
    console.log(`\n${message}\n`);
    this.writeLog('TEST', message);
  }

  /**
   * Log step
   * @param {string} stepDescription - Step description
   */
  step(stepDescription) {
    console.log(`📝 STEP: ${stepDescription}`);
    this.writeLog('STEP', stepDescription);
  }

  /**
   * Clear log file
   */
  clearLog() {
    if (fs.existsSync(this.logFilePath)) {
      fs.unlinkSync(this.logFilePath);
    }
  }

  /**
   * Create new log file with timestamp
   * @returns {string} New log file path
   */
  createNewLogFile() {
    const timestamp = new Date().toISOString().replace(/:/g, '-').replace(/\..+/, '');
    const newLogFileName = `test-execution_${timestamp}.log`;
    this.logFilePath = path.join(this.logDir, newLogFileName);
    return this.logFilePath;
  }
}

module.exports = Logger;

