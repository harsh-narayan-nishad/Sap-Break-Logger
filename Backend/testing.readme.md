# 🧪 Employee Tracking System - Postman Testing Guide

This guide provides comprehensive Postman testing instructions for all API endpoints in the Employee Tracking System backend based on the current implementation.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Postman Setup](#postman-setup)
3. [Environment Configuration](#environment-configuration)
4. [Import Postman Collection](#import-postman-collection)
5. [Testing Workflow](#testing-workflow)
6. [API Endpoint Testing](#api-endpoint-testing)
7. [Postman Testing Tips](#postman-testing-tips)
8. [Troubleshooting](#troubleshooting)

## 🚀 Prerequisites

Before testing with Postman, ensure you have:

- ✅ **Postman Desktop App** installed (recommended) or Postman Web
- ✅ Backend server running on `http://localhost:5000`
- ✅ MongoDB database connected and running
- ✅ Environment variables configured (`.env` file)
- ✅ `postman_collection.json` file available

## 🐘 Postman Setup

### 1. Install Postman
- **Desktop App**: Download from [postman.com](https://www.postman.com/downloads/)
- **Web Version**: Use [postman.com](https://web.postman.com/) (requires account)

### 2. Postman Features You'll Use
- **Collections**: Group related API requests
- **Environments**: Store variables for different environments
- **Tests**: Automate response validation
- **Pre-request Scripts**: Set up data before requests
- **Collection Runner**: Execute multiple requests in sequence

## 🔧 Environment Configuration

### 1. Create Postman Environment
1. Click the **"Environments"** tab in Postman
2. Click **"Add"** to create a new environment
3. Name it: `Employee Tracking System - Local`

### 2. Add Environment Variables
Add these variables to your environment:

| Variable | Initial Value | Current Value | Description |
|----------|---------------|---------------|-------------|
| `base_url` | `http://localhost:5000/api` | `http://localhost:5000/api` | Base API URL |
| `token` | `` | `` | JWT authentication token |
| `userId` | `` | `` | Current user ID for testing |
| `userEmail` | `test@example.com` | `test@example.com` | Test user email |
| `userPassword` | `password123` | `password123` | Test user password |
| `server_url` | `http://localhost:5000` | `http://localhost:5000` | Server base URL |

### 3. Save and Select Environment
1. Click **"Save"** to save the environment
2. Select your environment from the dropdown in the top-right corner

## 📥 Import Postman Collection

### 1. Import Collection
1. Click **"Import"** button in Postman
2. Select the `postman_collection.json` file from your root directory
3. Click **"Import"** to add the collection

### 2. Collection Structure
The imported collection will have:
- **Authentication** folder with 8 endpoints
- **Tracking** folder with 8 endpoints
- **Pre-configured requests** with example data
- **Test scripts** for auto-saving tokens and user IDs

### 3. Verify Collection Import
- Collection should appear in the left sidebar
- All 16 endpoints should be visible
- Request bodies should contain example data

## 🧪 Testing Workflow

### Phase 1: Initial Setup
1. **Health Check** → Verify server is running
2. **Environment Setup** → Configure Postman environment
3. **Collection Import** → Import the API collection

### Phase 2: Authentication Testing
1. **Register User** → Create test user account
2. **Login User** → Get JWT authentication token
3. **Verify Token** → Test protected endpoints

### Phase 3: Core Functionality Testing
1. **Profile Management** → Test user profile operations
2. **Break Tracking** → Test break start/end functionality
3. **Data Retrieval** → Test all GET endpoints

### Phase 4: Advanced Testing
1. **Error Scenarios** → Test validation and error handling
2. **Edge Cases** → Test boundary conditions
3. **Performance** → Test rate limiting and response times

## 📚 API Endpoint Testing

### 🔐 Authentication Endpoints

#### 1. Health Check
**Request Details:**
- **Method**: `GET`
- **URL**: `{{server_url}}/health`
- **Headers**: None required
- **Body**: None

**Postman Setup:**
1. Open the **"Health Check"** request in the collection
2. Verify URL uses `{{server_url}}/health`
3. Click **"Send"**

**Expected Response:**
```json
{
  "status": "OK",
  "message": "Employee Tracking System Backend is running",
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

**Test Result:** ✅ Server is running and healthy

---

#### 2. User Registration
**Request Details:**
- **Method**: `POST`
- **URL**: `{{base_url}}/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Test User",
  "email": "{{userEmail}}",
  "password": "{{userPassword}}"
}
```

**Postman Setup:**
1. Open the **"Register User"** request
2. Verify the request body uses environment variables
3. Click **"Send"**

**Expected Response:**
```json
{
  "error": false,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Test User",
      "email": "test@example.com",
      "status": "inactive",
      "dailyWorkTime": 0,
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

**Postman Test Script:**
```javascript
// Auto-save user ID and token
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("userId", response.data.user.id);
    pm.environment.set("token", response.data.data.token);
    
    // Verify response structure
    pm.test("User registered successfully", function () {
        pm.expect(response.error).to.be.false;
        pm.expect(response.message).to.include("registered successfully");
        pm.expect(response.data.user).to.have.property("id");
        pm.expect(response.data.data).to.have.property("token");
    });
}
```

**Test Result:** ✅ User created successfully, token and user ID auto-saved

---

#### 3. User Login
**Request Details:**
- **Method**: `POST`
- **URL**: `{{base_url}}/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "email": "{{userEmail}}",
  "password": "{{userPassword}}"
}
```

**Postman Setup:**
1. Open the **"Login User"** request
2. Verify the request body uses environment variables
3. Click **"Send"**

**Expected Response:**
```json
{
  "error": false,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Test User",
      "email": "test@example.com",
      "status": "active",
      "dailyWorkTime": 0,
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

**Postman Test Script:**
```javascript
// Auto-save token and user ID
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.data.token);
    pm.environment.set("userId", response.data.user.id);
    
    // Verify response structure
    pm.test("Login successful", function () {
        pm.expect(response.error).to.be.false;
        pm.expect(response.message).to.include("successful");
        pm.expect(response.data.user.status).to.equal("active");
        pm.expect(response.data.data).to.have.property("token");
    });
}
```

**Test Result:** ✅ Login successful, token auto-saved

---

#### 4. Get User Profile
**Request Details:**
- **Method**: `GET`
- **URL**: `{{base_url}}/auth/profile`
- **Headers**: `Authorization: Bearer {{token}}`
- **Body**: None

**Postman Setup:**
1. Open the **"Get Profile"** request
2. Verify the Authorization header uses `{{token}}`
3. Click **"Send"**

**Expected Response:**
```json
{
  "error": false,
  "message": "Profile retrieved successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Test User",
      "email": "test@example.com",
      "status": "active",
      "dailyWorkTime": 0,
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify profile data
pm.test("Profile retrieved successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("retrieved successfully");
    pm.expect(response.data.user).to.have.property("id");
    pm.expect(response.data.user).to.have.property("name");
    pm.expect(response.data.user).to.have.property("email");
});
```

**Test Result:** ✅ Profile retrieved successfully

---

#### 5. Update User Profile
**Request Details:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/auth/profile`
- **Headers**: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "name": "Updated Test User",
  "email": "updated@example.com"
}
```

**Postman Setup:**
1. Open the **"Update Profile"** request
2. Verify headers and request body
3. Click **"Send"**

**Expected Response:**
```json
{
  "error": false,
  "message": "Profile updated successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Updated Test User",
      "email": "updated@example.com",
      "status": "active",
      "dailyWorkTime": 0,
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify profile update
pm.test("Profile updated successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("updated successfully");
    pm.expect(response.data.user.name).to.equal("Updated Test User");
    pm.expect(response.data.user.email).to.equal("updated@example.com");
});
```

**Test Result:** ✅ Profile updated successfully

---

#### 6. Change Password
**Request Details:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/auth/change-password`
- **Headers**: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "currentPassword": "{{userPassword}}",
  "newPassword": "newpassword123"
}
```

**Postman Setup:**
1. Open the **"Change Password"** request
2. Verify headers and request body
3. Click **"Send"**

**Expected Response:**
```json
{
  "error": false,
  "message": "Password changed successfully"
}
```

**Postman Test Script:**
```javascript
// Verify password change
pm.test("Password changed successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("changed successfully");
});
```

**Test Result:** ✅ Password changed successfully

---

#### 7. Get All Users
**Request Details:**
- **Method**: `GET`
- **URL**: `{{base_url}}/auth/users`
- **Headers**: `Authorization: Bearer {{token}}`
- **Body**: None

**Postman Setup:**
1. Open the **"Get All Users"** request
2. Verify the Authorization header
3. Click **"Send"**

**Expected Response:**
```json
{
  "error": false,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "user_id_here",
        "name": "Updated Test User",
        "email": "updated@example.com",
        "status": "active",
        "dailyWorkTime": 0,
        "createdAt": "2025-01-20T10:00:00.000Z",
        "updatedAt": "2025-01-20T10:00:00.000Z"
      }
    ]
  }
}
```

**Postman Test Script:**
```javascript
// Verify users list
pm.test("Users retrieved successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("retrieved successfully");
    pm.expect(response.data.users).to.be.an('array');
    pm.expect(response.data.users.length).to.be.greaterThan(0);
});
```

**Test Result:** ✅ All users retrieved successfully

---

#### 8. Logout User
**Request Details:**
- **Method**: `POST`
- **URL**: `{{base_url}}/auth/logout`
- **Headers**: `Authorization: Bearer {{token}}`
- **Body**: None

**Postman Setup:**
1. Open the **"Logout User"** request
2. Verify the Authorization header
3. Click **"Send"**

**Expected Response:**
```json
{
  "error": false,
  "message": "Logout successful"
}
```

**Postman Test Script:**
```javascript
// Verify logout
pm.test("Logout successful", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("successful");
});

// Clear token after logout
pm.environment.set("token", "");
```

**Test Result:** ✅ User logged out, token cleared

---

### 📊 Tracking Management Endpoints

#### 9. Start Break
**Request Details:**
- **Method**: `POST`
- **URL**: `{{base_url}}/tracking/start-break`
- **Headers**: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "startTime": "14:30"
}
```

**Postman Setup:**
1. Open the **"Start Break"** request
2. Verify headers and request body
3. Click **"Send"**

**Expected Response:**
```json
{
  "error": false,
  "message": "Break started successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Updated Test User",
      "email": "updated@example.com",
      "status": "break",
      "currentBreakStart": "2025-01-20T14:30:00.000Z",
      "dailyWorkTime": 0
    },
    "dayRecord": {
      "id": "day_record_id",
      "userId": "user_id_here",
      "date": "2025-01-20",
      "workTime": 0,
      "breaks": [
        {
          "start": "14:30",
          "end": null,
          "duration": 0
        }
      ],
      "totalBreakTime": 0,
      "status": "break"
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify break started
pm.test("Break started successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("started successfully");
    pm.expect(response.data.user.status).to.equal("break");
    pm.expect(response.data.dayRecord.status).to.equal("break");
});
```

**Test Result:** ✅ Break started, user status changed to 'break'

---

#### 10. Get Today's Data
**Request Details:**
- **Method**: `GET`
- **URL**: `{{base_url}}/tracking/today`
- **Headers**: `Authorization: Bearer {{token}}`
- **Body**: None

**Postman Setup:**
1. Open the **"Get Today's Data"** request
2. Verify the Authorization header
3. Click **"Send"`

**Expected Response:**
```json
{
  "error": false,
  "message": "Today's data retrieved successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Updated Test User",
      "email": "updated@example.com",
      "status": "break",
      "currentBreakStart": "2025-01-20T14:30:00.000Z",
      "dailyWorkTime": 0
    },
    "dayRecord": {
      "id": "day_record_id",
      "userId": "user_id_here",
      "date": "2025-01-20",
      "workTime": 0,
      "breaks": [
        {
          "start": "14:30",
          "end": null,
          "duration": 0
        }
      ],
      "totalBreakTime": 0,
      "status": "break"
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify today's data
pm.test("Today's data retrieved successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("retrieved successfully");
    pm.expect(response.data).to.have.property("user");
    pm.expect(response.data).to.have.property("dayRecord");
});
```

**Test Result:** ✅ Today's data retrieved, shows active break

---

#### 11. End Break
**Request Details:**
- **Method**: `POST`
- **URL**: `{{base_url}}/tracking/end-break`
- **Headers**: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "endTime": "14:45"
}
```

**Postman Setup:**
1. Open the **"End Break"** request
2. Verify headers and request body
3. Click **"Send"`

**Expected Response:**
```json
{
  "error": false,
  "message": "Break ended successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Updated Test User",
      "email": "updated@example.com",
      "status": "active",
      "currentBreakStart": null,
      "dailyWorkTime": 0
    },
    "dayRecord": {
      "id": "day_record_id",
      "userId": "user_id_here",
      "date": "2025-01-20",
      "workTime": 0,
      "breaks": [
        {
          "start": "14:30",
          "end": "14:45",
          "duration": 15
        }
      ],
      "totalBreakTime": 15,
      "status": "active"
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify break ended
pm.test("Break ended successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("ended successfully");
    pm.expect(response.data.user.status).to.equal("active");
    pm.expect(response.data.dayRecord.status).to.equal("active");
});
```

**Test Result:** ✅ Break ended, user status back to 'active', break duration calculated

---

#### 12. Update Work Time
**Request Details:**
- **Method**: `PUT`
- **URL**: `{{base_url}}/tracking/work-time`
- **Headers**: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- **Body** (raw JSON):
```json
{
  "minutes": 480
}
```

**Postman Setup:**
1. Open the **"Update Work Time"** request
2. Verify headers and request body
3. Click **"Send"`

**Expected Response:**
```json
{
  "error": false,
  "message": "Work time updated successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Updated Test User",
      "email": "updated@example.com",
      "status": "active",
      "currentBreakStart": null,
      "dailyWorkTime": 480
    },
    "dayRecord": {
      "id": "day_record_id",
      "userId": "user_id_here",
      "date": "2025-01-20",
      "workTime": 480,
      "breaks": [
        {
          "start": "14:30",
          "end": "14:45",
          "duration": 15
        }
      ],
      "totalBreakTime": 15,
      "status": "active"
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify work time update
pm.test("Work time updated successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("updated successfully");
    pm.expect(response.data.user.dailyWorkTime).to.equal(480);
    pm.expect(response.data.dayRecord.workTime).to.equal(480);
});
```

**Test Result:** ✅ Work time updated to 480 minutes (8 hours)

---

#### 13. Get User Statistics
**Request Details:**
- **Method**: `GET`
- **URL**: `{{base_url}}/tracking/stats?period=week`
- **Headers**: `Authorization: Bearer {{token}}`
- **Body**: None

**Postman Setup:**
1. Open the **"Get User Statistics"** request
2. Verify the Authorization header and query parameters
3. Click **"Send"`

**Expected Response:**
```json
{
  "error": false,
  "message": "User statistics retrieved successfully",
  "data": {
    "period": "week",
    "startDate": "2025-01-13",
    "endDate": "2025-01-20",
    "stats": {
      "totalWorkTime": 480,
      "totalBreakTime": 15,
      "totalDays": 1,
      "averageWorkTime": 480,
      "averageBreakTime": 15,
      "mostProductiveDay": {
        "date": "2025-01-20",
        "workTime": 480,
        "totalBreakTime": 15
      },
      "leastProductiveDay": {
        "date": "2025-01-20",
        "workTime": 480,
        "totalBreakTime": 15
      }
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify statistics
pm.test("User statistics retrieved successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("retrieved successfully");
    pm.expect(response.data).to.have.property("stats");
    pm.expect(response.data.stats).to.have.property("totalWorkTime");
});
```

**Test Result:** ✅ Statistics retrieved successfully

---

#### 14. Get All Users (Tracking)
**Request Details:**
- **Method**: `GET`
- **URL**: `{{base_url}}/tracking/users`
- **Headers**: `Authorization: Bearer {{token}}`
- **Body**: None

**Postman Setup:**
1. Open the **"Get All Users (Tracking)"** request
2. Verify the Authorization header
3. Click **"Send"`

**Expected Response:**
```json
{
  "error": false,
  "message": "Users retrieved successfully",
  "data": {
    "users": [
      {
        "id": "user_id_here",
        "name": "Updated Test User",
        "email": "updated@example.com",
        "status": "active",
        "dailyWorkTime": 480,
        "lastActiveDate": "2025-01-20T10:00:00.000Z"
      }
    ]
  }
}
```

**Postman Test Script:**
```javascript
// Verify users list
pm.test("Users retrieved successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("retrieved successfully");
    pm.expect(response.data.users).to.be.an('array');
});
```

**Test Result:** ✅ All users retrieved with current status

---

#### 15. Get User Monthly Data
**Request Details:**
- **Method**: `GET`
- **URL**: `{{base_url}}/tracking/user/{{userId}}/monthly?month=1&year=2025`
- **Headers**: `Authorization: Bearer {{token}}`
- **Body**: None

**Postman Setup:**
1. Open the **"Get User Monthly Data"** request
2. Verify the URL uses `{{userId}}` and query parameters
3. Click **"Send"`

**Expected Response:**
```json
{
  "error": false,
  "message": "Monthly data retrieved successfully",
  "data": {
    "user": {
      "id": "user_id_here",
      "name": "Updated Test User",
      "email": "updated@example.com",
      "status": "active"
    },
    "month": "2025-01",
    "data": {
      "2025-01-20": {
        "workTime": 480,
        "breaks": [
          {
            "start": "14:30",
            "end": "14:45",
            "duration": 15
          }
        ],
        "totalBreakTime": 15,
        "status": "active"
      }
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify monthly data
pm.test("Monthly data retrieved successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("retrieved successfully");
    pm.expect(response.data).to.have.property("month");
    pm.expect(response.data).to.have.property("data");
});
```

**Test Result:** ✅ Monthly data retrieved successfully

---

#### 16. Get All Users Monthly Data
**Request Details:**
- **Method**: `GET`
- **URL**: `{{base_url}}/tracking/monthly?month=1&year=2025`
- **Headers**: `Authorization: Bearer {{token}}`
- **Body**: None

**Postman Setup:**
1. Open the **"Get All Users Monthly Data"** request
2. Verify the Authorization header and query parameters
3. Click **"Send"`

**Expected Response:**
```json
{
  "error": false,
  "message": "All users monthly data retrieved successfully",
  "data": {
    "month": "2025-01",
    "users": {
      "Updated Test User": {
        "2025-01-20": {
          "workTime": 480,
          "breaks": [
            {
              "start": "14:30",
              "end": "14:45",
              "duration": 15
            }
          ],
          "totalBreakTime": 15,
          "status": "active"
        }
      }
    }
  }
}
```

**Postman Test Script:**
```javascript
// Verify all users monthly data
pm.test("All users monthly data retrieved successfully", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
    pm.expect(response.message).to.include("retrieved successfully");
    pm.expect(response.data).to.have.property("users");
});
```

**Test Result:** ✅ All users monthly data retrieved successfully

---

## 🎯 Postman Testing Tips

### 1. Use Collection Runner
1. Click **"Collection Runner"** button
2. Select your collection
3. Choose environment
4. Set iterations and delay
5. Click **"Start Run"**

### 2. Environment Variables Best Practices
- **Never hardcode** sensitive data
- **Use descriptive names** for variables
- **Set initial values** for testing
- **Clear sensitive data** after testing

### 3. Test Scripts for Automation
```javascript
// Example test script structure
pm.test("Test description", function () {
    // Your test logic here
    pm.expect(response.error).to.be.false;
    pm.expect(response.data).to.have.property("user");
});

// Auto-save important data
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
}
```

### 4. Pre-request Scripts
```javascript
// Set up data before request
pm.environment.set("timestamp", new Date().toISOString());
pm.environment.set("randomId", Math.random().toString(36).substr(2, 9));
```

### 5. Response Validation
```javascript
// Validate response structure
pm.test("Response has correct structure", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property("error");
    pm.expect(response).to.have.property("message");
    pm.expect(response).to.have.property("data");
});

// Validate data types
pm.test("Data types are correct", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.a('boolean');
    pm.expect(response.message).to.be.a('string');
});
```

## 🚨 Error Testing in Postman

### 1. Test Invalid Authentication
1. **Clear token**: Set `{{token}}` to empty string
2. **Send request** to protected endpoint
3. **Expected**: `401 Unauthorized`

### 2. Test Validation Errors
1. **Send invalid data** (missing fields, wrong format)
2. **Expected**: `400 Bad Request` with validation details

### 3. Test Rate Limiting
1. **Send multiple rapid requests**
2. **Expected**: `429 Too Many Requests` after limit

## 🔍 Validation Testing in Postman

### 1. Test Required Fields
- Remove required fields from request body
- Send request
- Verify validation error response

### 2. Test Data Format Validation
- Send invalid time format (e.g., "25:70")
- Send invalid date format
- Verify format validation errors

### 3. Test Data Type Validation
- Send string instead of number
- Send invalid email format
- Verify type validation errors

## 📊 Performance Testing in Postman

### 1. Response Time Testing
```javascript
// Test response time
pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});
```

### 2. Load Testing
- Use **Collection Runner** with multiple iterations
- Set delays between requests
- Monitor response times and success rates

## 🐛 Troubleshooting Postman Issues

### Common Issues and Solutions

#### 1. Environment Variables Not Working
**Problem:** Variables not being replaced in requests
**Solution:** 
- Verify environment is selected
- Check variable names match exactly
- Use `{{variable_name}}` syntax

#### 2. Tests Not Running
**Problem:** Test scripts not executing
**Solution:**
- Check "Tests" tab in request
- Verify JavaScript syntax
- Check Postman console for errors

#### 3. Collection Import Issues
**Problem:** Collection not importing correctly
**Solution:**
- Verify JSON file format
- Check Postman version compatibility
- Try importing individual requests

#### 4. Authentication Problems
**Problem:** JWT tokens not working
**Solution:**
- Verify token format in Authorization header
- Check token expiration
- Ensure token is saved in environment

### Debug Mode in Postman
1. **Open Postman Console**: View → Show Postman Console
2. **Check Network Tab**: Monitor actual HTTP requests
3. **Verify Headers**: Ensure all headers are sent correctly

## ✅ Postman Testing Checklist

- [ ] Environment variables configured
- [ ] Collection imported successfully
- [ ] Health check endpoint working
- [ ] User registration working
- [ ] User login working
- [ ] JWT token auto-saved
- [ ] All protected endpoints accessible
- [ ] Break management working
- [ ] Data retrieval working
- [ ] Error handling tested
- [ ] Validation rules tested
- [ ] Test scripts working
- [ ] Environment variables clearing properly

## 🎉 Success Criteria

All Postman tests pass when:
- ✅ All 16 endpoints return expected responses
- ✅ Environment variables work correctly
- ✅ Test scripts execute without errors
- ✅ Authentication flows work properly
- ✅ Data validation catches errors
- ✅ Error handling provides meaningful messages
- ✅ Performance meets requirements

## 📞 Support

If you encounter issues during Postman testing:
1. Check the troubleshooting section
2. Verify environment configuration
3. Check Postman console for errors
4. Ensure backend server is running
5. Verify MongoDB connection

## 🚀 Quick Start Postman Testing

```bash
# 1. Start backend server
npm run dev

# 2. Open Postman
# 3. Import postman_collection.json
# 4. Set up environment variables
# 5. Start with Health Check
# 6. Follow the testing workflow
```

---

**Happy Postman Testing! 🧪✨**
