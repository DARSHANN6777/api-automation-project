// reqres-api-automation.ts
import { test, expect, APIRequestContext } from '@playwright/test';

// Interfaces updated for JSONPlaceholder API
interface User {
  id?: number;
  name: string;
  job?: string;  // Make job optional since JSONPlaceholder doesn't use it
  email?: string;
  username?: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

// Interface for API responses
interface CreateUserResponse {
  id: string | number;  // JSONPlaceholder returns number
  name: string;
  job?: string;
  createdAt?: string;
}

interface GetUserResponse {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

interface UpdateUserResponse {
  id?: number;
  name?: string;
  job?: string;
  updatedAt?: string;
  // JSONPlaceholder returns full user object for PATCH
  username?: string;
  email?: string;
  phone?: string;
  website?: string;
  company?: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}

test.describe('JSONPlaceholder API Automation Tests', () => {
  let request: APIRequestContext;
  let userId: string;

  // This runs before all tests in this describe block
  test.beforeAll(async ({ playwright }) => {
    // Create a new API request context
    request = await playwright.request.newContext({
      baseURL: 'https://jsonplaceholder.typicode.com',
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
  });

  // This runs after all tests to clean up
  test.afterAll(async () => {
    await request.dispose();
  });

  test('Complete API Workflow: Create → Get → Update User', async () => {
    console.log(' Starting API automation workflow...\n');

    // ==========================================
    // STEP 1: CREATE A USER
    // ==========================================
    console.log('STEP 1: Creating a new user...');
    
    const newUser: User = {
      name: "John Doe",
      job: "Software Engineer"
    };

    // Make POST request to create user
    const createResponse = await request.post('/users', {
      data: newUser
    });

    // Validate HTTP status code (should be 201 for created)
    console.log(`Create user status: ${createResponse.status()}`);
    expect(createResponse.status()).toBe(201);

    // Parse the response JSON
    const createResponseBody: CreateUserResponse = await createResponse.json();
    console.log(' Create response body:', JSON.stringify(createResponseBody, null, 2));

    // Store the user ID for later use
    userId = createResponseBody.id.toString();
    console.log(`Stored userId: ${userId}\n`);

    // Validate response structure and data
    expect(createResponseBody.id).toBeDefined();
    expect(createResponseBody.name).toBe(newUser.name);
    expect(createResponseBody.job).toBe(newUser.job);

    // ==========================================
    // STEP 2: GET USER DETAILS
    // ==========================================
    console.log('STEP 2: Fetching user details...');

    // Make GET request to fetch user details
    // Note: JSONPlaceholder has predefined users with IDs 1-10
    // Since we can't actually fetch our created user, we'll fetch user with ID 2
    const getUserResponse = await request.get('/users/2');

    console.log(` Get user status: ${getUserResponse.status()}`);
    expect(getUserResponse.status()).toBe(200);

    const getUserResponseBody: GetUserResponse = await getUserResponse.json();
    console.log('Get user response:', JSON.stringify(getUserResponseBody, null, 2));

    // Validate the response structure
    expect(getUserResponseBody.id).toBeDefined();
    expect(getUserResponseBody.name).toBeDefined();
    expect(getUserResponseBody.email).toBeDefined();
    expect(getUserResponseBody.username).toBeDefined();
    console.log(`User details - Name: ${getUserResponseBody.name} (${getUserResponseBody.username})\n`);

    // ==========================================
    // STEP 3: UPDATE USER
    // ==========================================
    console.log('STEP 3: Updating user information...');

    const updatedUser = {
      name: "John Smith", // Changed name
      job: "Senior Software Engineer" // Updated job title
    };

    // Make PUT request to update user
    const updateResponse = await request.put('/users/2', {
      data: updatedUser
    });

    console.log(`Update user status: ${updateResponse.status()}`);
    expect(updateResponse.status()).toBe(200);

    const updateResponseBody: UpdateUserResponse = await updateResponse.json();
    console.log('Update response:', JSON.stringify(updateResponseBody, null, 2));

    // Validate the updated data
    expect(updateResponseBody.name).toBe(updatedUser.name);
    expect(updateResponseBody.job).toBe(updatedUser.job);

    console.log('API automation workflow completed successfully!');
  });

  // DEBUG TEST - Add this first to understand the issue
  test('Debug API Endpoints', async () => {
    console.log('Debugging API endpoints...');
    
    // Test the actual URL being constructed
    const testResponse = await request.get('/users/1');
    console.log(`GET /users/1 status: ${testResponse.status()}`);
    
    // Fixed: Get the baseURL from the request context properly
    const requestContext = await test.info().project.use?.baseURL || 'https://jsonplaceholder.typicode.com';
    console.log(`Base URL: ${requestContext}`);
    
    if (testResponse.ok()) {
      const body = await testResponse.json();
      console.log('GET response:', JSON.stringify(body, null, 2));
    }
    
    // Try POST to see what happens
    const postResponse = await request.post('/users', {
      data: { name: "Test", job: "Tester" }
    });
    
    console.log(`POST /users status: ${postResponse.status()}`);
    
    // Log the actual response for debugging
    const responseText = await postResponse.text();
    console.log('POST response body:', responseText);
    
    // Don't fail the test, just gather info
    expect(testResponse.status()).toBeGreaterThanOrEqual(200);
  });

  // Additional test for error handling
  test('Handle API Error - Get Non-existent User', async () => {
    console.log('Testing error handling for non-existent user...');

    const response = await request.get('/users/999');
    
    console.log(`Status: ${response.status()}`);
    expect(response.status()).toBe(404);
    
    const responseBody = await response.json();
    console.log('Error response:', JSON.stringify(responseBody, null, 2));
  });

  // Test for different HTTP methods - FIXED
  test('Test PATCH method for partial update', async () => {
    console.log('Testing PATCH method for partial update...');

    const partialUpdate = {
      job: "Tech Lead"
    };

    const patchResponse = await request.patch('/users/2', {
      data: partialUpdate
    });

    expect(patchResponse.status()).toBe(200);
    
    const patchResponseBody: UpdateUserResponse = await patchResponse.json();
    console.log('PATCH response:', JSON.stringify(patchResponseBody, null, 2));
    
    // FIXED: JSONPlaceholder doesn't return updatedAt for PATCH requests
    // It returns the full user object with the job field added
    expect(patchResponseBody.job).toBe(partialUpdate.job);
    
    // Validate that it's still the same user (user ID 2)
    expect(patchResponseBody.id).toBe(2);
    expect(patchResponseBody.name).toBeDefined(); // Should still have the original name
  });

  // Test DELETE method
  test('Test DELETE method', async () => {
    console.log('Testing DELETE method...');

    const deleteResponse = await request.delete('/users/2');
    
    console.log(`Delete status: ${deleteResponse.status()}`);
    expect(deleteResponse.status()).toBe(200); // JSONPlaceholder returns 200, not 204
    
    // JSONPlaceholder returns an empty object for DELETE
    const deleteResponseBody = await deleteResponse.json();
    console.log('Delete response body:', JSON.stringify(deleteResponseBody, null, 2));
  });

  // Test with query parameters
  test('Test GET with query parameters', async () => {
    console.log('Testing GET with query parameters...');

    // Get users from a specific company
    const response = await request.get('/users?_limit=3');
    
    console.log(`GET with limit status: ${response.status()}`);
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    console.log(`Found ${users.length} users with limit`);
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeLessThanOrEqual(3);
  });

  // Test response time performance
  test('Test API Response Time Performance', async () => {
    console.log('Testing API response time...');

    const startTime = Date.now();
    const response = await request.get('/users');
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    console.log(`Response time: ${responseTime}ms`);
    
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(5000); // Should respond within 5 seconds
  });
});

// Additional utility functions for complex scenarios

class ApiHelper {
  private request: APIRequestContext;
  private baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  // Helper method to create a user with error handling
  async createUser(userData: User): Promise<CreateUserResponse> {
    try {
      const response = await this.request.post('/users', {
        data: userData
      });

      if (!response.ok()) {
        throw new Error(`Failed to create user: ${response.status()} ${response.statusText()}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Helper method to get user with retry logic
  async getUserWithRetry(userId: number, maxRetries: number = 3): Promise<GetUserResponse> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await this.request.get(`/users/${userId}`);
        
        if (response.ok()) {
          return await response.json();
        }
        
        if (i === maxRetries - 1) {
          throw new Error(`Failed to get user after ${maxRetries} attempts`);
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        
      } catch (error) {
        if (i === maxRetries - 1) throw error;
      }
    }
    throw new Error('Unexpected error in retry logic');
  }

  // Helper method to validate response schema
  validateUserResponse(response: any): boolean {
    // JSONPlaceholder user objects have these required fields
    const requiredFields = ['id', 'name', 'username', 'email'];
    
    return requiredFields.every(field => response.hasOwnProperty(field) && response[field] !== null);
  }

  // Helper method to get all users
  async getAllUsers(): Promise<GetUserResponse[]> {
    const response = await this.request.get('/users');
    
    if (!response.ok()) {
      throw new Error(`Failed to get users: ${response.status()} ${response.statusText()}`);
    }
    
    return await response.json();
  }

  // Helper method to search users by name
  async searchUsersByName(name: string): Promise<GetUserResponse[]> {
    const allUsers = await this.getAllUsers();
    return allUsers.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
  }
}

// Example test using the helper class
test('Using API Helper Class - Enhanced', async ({ playwright }) => {
  const request = await playwright.request.newContext({
    baseURL: 'https://jsonplaceholder.typicode.com'
  });

  const apiHelper = new ApiHelper(request, 'https://jsonplaceholder.typicode.com');

  try {
    // Create user using helper
    const newUser: User = {
      name: "Jane Doe",
      job: "Product Manager"
    };

    const createdUser = await apiHelper.createUser(newUser);
    console.log('Created user via helper:', createdUser);

    // Get user with retry
    const fetchedUser = await apiHelper.getUserWithRetry(1);
    console.log('Fetched user via helper:', fetchedUser.name);

    // Validate response schema
    const isValid = apiHelper.validateUserResponse(fetchedUser);
    expect(isValid).toBe(true);
    console.log('User response validation passed');

    // Test search functionality
    const searchResults = await apiHelper.searchUsersByName('Leanne');
    console.log(`Found ${searchResults.length} users matching 'Leanne'`);
    expect(searchResults.length).toBeGreaterThan(0);

    // Get all users
    const allUsers = await apiHelper.getAllUsers();
    console.log(`Retrieved ${allUsers.length} total users`);
    expect(allUsers.length).toBe(10); // JSONPlaceholder has 10 users

  } finally {
    await request.dispose();
  }
});

// Data-driven test example
test.describe('Data-Driven API Tests', () => {
  const testUsers = [
    { name: "Alice Johnson", job: "Designer" },
    { name: "Bob Smith", job: "Developer" },
    { name: "Carol Davis", job: "Manager" }
  ];

  testUsers.forEach((userData, index) => {
    test(`Create user ${index + 1}: ${userData.name}`, async ({ playwright }) => {
      const request = await playwright.request.newContext({
        baseURL: 'https://jsonplaceholder.typicode.com'
      });

      const response = await request.post('/users', {
        data: userData
      });

      expect(response.status()).toBe(201);
      
      const createdUser = await response.json();
      expect(createdUser.name).toBe(userData.name);
      expect(createdUser.job).toBe(userData.job);

      console.log(`Successfully created user: ${userData.name}`);

      await request.dispose();
    });
  });
});