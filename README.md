API Automation Project - Complete Setup Guide
🚀 Project Overview
This project demonstrates comprehensive API automation testing using Playwright with TypeScript. It tests the ReqRes API (https://reqres.in/) covering CRUD operations with proper validation and error handling.
📋 Features

✅ Complete CRUD operations (Create, Read, Update, Delete)
✅ HTTP status code validation
✅ Response data validation
✅ Error handling and edge cases
✅ Data-driven testing
✅ Helper utilities for API operations
✅ Comprehensive logging and reporting
✅ Performance testing
✅ Retry mechanisms

🛠️ Prerequisites
Before running this project, ensure you have the following installed:

Node.js (version 14 or higher) - Download here
npm (comes with Node.js)
Git - Download here
VS Code (recommended) - Download here

📥 Installation & Setup
Step 1: Clone the Repository
bash# Clone the repository
git clone https://github.com/YOUR_USERNAME/api-automation-playwright.git

# Navigate to the project directory
cd api-automation-playwright
Step 2: Install Dependencies
bash# Install all project dependencies
npm install

# Install Playwright browsers
npx playwright install
Step 3: Verify Installation
bash# Check if everything is installed correctly
npm run test:dry
🚀 Running the Tests
Run All Tests
bash# Run all API tests
npm test
Run Specific Test Suite
bash# Run only the main workflow test
npx playwright test --grep "Complete API Workflow"

# Run only error handling tests
npx playwright test --grep "Error Handling"
Run Tests in Different Modes
bash# Run tests in headed mode (visible browser)
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with detailed reporting
npm run test:report
📊 Test Reports
After running tests, you can view detailed HTML reports:
bash# Open the HTML report
npx playwright show-report
📁 Project Structure
api-automation-playwright/
├── tests/
│   ├── reqres-api.spec.ts          # Main API test file
│   └── api-helpers/
│       └── reqres-helper.ts        # Helper utilities
├── playwright.config.ts            # Playwright configuration
├── package.json                   # Project dependencies
├── package-lock.json             # Lock file
├── README.md                     # This file
└── .github/
    └── workflows/
        └── api-tests.yml         # GitHub Actions CI/CD
🧪 Test Coverage
Main Test Scenarios:

Create User - POST /api/users
Get User Details - GET /api/users/{id}
Update User - PUT /api/users/{id}
Partial Update - PATCH /api/users/{id}
Delete User - DELETE /api/users/{id}
Error Handling - Invalid requests and responses
Performance Testing - Response time validation
Data-Driven Tests - Multiple user scenarios

API Endpoints Tested:

POST /api/users - Create user
GET /api/users/{id} - Get user by ID
GET /api/users - Get all users with pagination
PUT /api/users/{id} - Update user
PATCH /api/users/{id} - Partial update user
DELETE /api/users/{id} - Delete user

⚙️ Configuration
Playwright Configuration (playwright.config.ts)
typescriptimport { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['json', { outputFile: 'test-results/results.json' }]
  ],
  use: {
    baseURL: 'https://reqres.in/api',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'API Tests',
      testMatch: '**/*.spec.ts',
    },
  ],
});
🔧 Environment Variables
Create a .env file in the root directory for environment-specific configurations:
bash# API Configuration
BASE_URL=https://reqres.in/api
TIMEOUT=30000
RETRIES=2

# Test Configuration
PARALLEL_WORKERS=4
HEADLESS=true
🐛 Troubleshooting
Common Issues:

Tests failing with network errors

bash   # Check internet connection and API availability
   curl https://reqres.in/api/users/1

Playwright not installed properly

bash   # Reinstall Playwright
   npm uninstall @playwright/test
   npm install @playwright/test
   npx playwright install

Node version compatibility

bash   # Check Node.js version (should be 14+)
   node --version
📈 Continuous Integration
The project includes GitHub Actions workflow for automated testing:
yaml# .github/workflows/api-tests.yml
name: API Automation Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright
      run: npx playwright install --with-deps
    - name: Run API tests
      run: npm test
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: test-results
        path: test-results/
📝 Contributing

Fork the repository
Create a feature branch (git checkout -b feature/new-test)
Commit your changes (git commit -am 'Add new test scenario')
Push to the branch (git push origin feature/new-test)
Create a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.