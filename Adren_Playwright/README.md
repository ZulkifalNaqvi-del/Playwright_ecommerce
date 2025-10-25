# E-Commerce Checkout Flow Automation - Playwright

## Overview
Automated test suite for Demo Web Shop (https://demowebshop.tricentis.com/) using Playwright with JavaScript and Page Object Model architecture.

## Installation

```bash
npm install
npx playwright install
```

## Run Tests

```bash
# Run all tests (headless)
npm test

# Run with browser visible
npm run test:headed

# Debug mode
npm run test:debug

# Interactive UI mode
npm run test:ui
```

## View Reports

```bash
# Playwright HTML Report
npm run report

# Allure Report
npm run allure:generate
npm run allure:open
```

## Test Coverage

### Main E2E Test Flow
1. User registration (dynamic email)
2. Logout
3. Login with credentials
4. Browse products (Books category)
5. Add 3 products to cart
6. Validate cart (items & pricing)
7. Complete checkout process
8. Verify order confirmation

### Additional Tests
- Cart operations (add, update, remove)
- Product search functionality

## Project Structure

```
├── pages/              # Page Object Model classes
├── tests/              # Test specifications
├── fixtures/           # Custom Playwright fixtures
├── utils/              # Utility classes (Logger, TestDataManager, TestHelper)
├── testData/           # JSON test data files
├── playwright.config.js # Configuration
└── package.json        # Dependencies
```

## Technology Stack

- **Framework**: Playwright v1.40.0
- **Language**: JavaScript (Node.js)
- **Architecture**: Page Object Model (POM)
- **Reporting**: HTML, Allure, JSON, JUnit

## Features

✅ Page Object Model architecture
✅ Dynamic test data generation
✅ Comprehensive error handling
✅ Auto-screenshots on failure
✅ Multiple report formats
✅ Custom logging system
✅ Proper synchronization & waits

## Configuration

Edit `playwright.config.js` to customize:
- Timeouts
- Browsers
- Reporters
- Base URL
- Screenshot/video options

## Test Data

Test data is stored in `testData/userData.json`:
- User registration data
- Billing/shipping addresses
- Product information

## Output Files

After running tests:
- **screenshots/** - Test screenshots
- **logs/** - Execution logs
- **playwright-report/** - HTML test report
- **allure-results/** - Allure raw data
- **test-results/** - JSON & JUnit results

## Contact

For questions: menna.12eid@gmail.com / menna.eid@unioncoop.ae
