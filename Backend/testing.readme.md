# 🧪 Employee Tracking System - API Testing Guide

This guide provides comprehensive testing instructions for all API endpoints in the Employee Tracking System backend based on the current implementation.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Current Backend Structure](#current-backend-structure)
4. [Testing with Postman](#testing-with-postman)
5. [Direct API Testing](#direct-api-testing)
6. [API Endpoint Testing](#api-endpoint-testing)
7. [Test Scenarios](#test-scenarios)
8. [Troubleshooting](#troubleshooting)

## 🚀 Prerequisites

Before testing, ensure you have:

- ✅ Backend server running on `http://localhost:5000`
- ✅ MongoDB database connected and running
- ✅ Environment variables configured (`.env` file)
- ✅ Postman installed (for Postman testing)
- ✅ Any HTTP client (for direct API testing)

## 🔧 Environment Setup

### 1. Backend Environment Variables
Create a `.env` file in the root directory (same level as server.js):

```env
MONGODB_URI=mongodb://localhost:27017/employee-tracking
JWT_SECRET=your-super-secret-jwt-key-for-testing
PORT=5000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 2. Start the Backend Server
```bash
# From the root directory (where server.js is located)
npm install
npm run dev
```

### 3. Verify Server is Running
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Employee Tracking System Backend is running",
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

## 🏗️ Current Backend Structure

The backend is currently implemented with the following structure:

```
Root Directory/
├── server.js                 # Main server file
├── package.json             # Dependencies
├── .env                     # Environment variables
├── routes/
│   ├── auth.js             # Authentication routes
│   └── tracking.js         # Tracking management routes
├── controllers/
│   ├── authController.js   # Authentication logic
│   └── trackingController.js # Tracking logic
├── models/
│   ├── User.js             # User model
│   ├── DayRecord.js        # Daily tracking model
│   └── Break.js            # Break tracking model
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── errorHandler.js     # Error handling
│   └── validation.js       # Request validation
└── postman_collection.json # API testing collection
```

## 🧪 Testing with Postman

### 1. Import Postman Collection
1. Open Postman
2. Click "Import" button
3. Select the `postman_collection.json` file from the root directory
4. Collection will be imported with all endpoints

### 2. Set Up Postman Environment
1. Click the "Environments" tab in Postman
2. Click "Add" to create a new environment
3. Add these variables:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5000/api` | `http://localhost:5000/api` |
| `token` | `` | `` |
| `userId` | `` | `` |

4. Save the environment and select it

### 3. Test Flow in Postman
Follow this sequence for testing:

1. **Health Check** → Verify server is running
2. **Register User** → Create a test user
3. **Login User** → Get authentication token
4. **Test Protected Endpoints** → Use the token for authenticated requests

## 🔗 Direct API Testing

### Using cURL Commands
All endpoints can be tested directly using cURL commands from terminal.

### Using Browser Developer Tools
For GET requests, you can test directly in browser console.

## 📚 API Endpoint Testing

### 🔐 Authentication Endpoints

#### 1. Health Check
**Endpoint:** `GET /health`  
**URL:** `http://localhost:5000/health`  
**Authentication:** None required

**Postman:**
- Method: `GET`
- URL: `http://localhost:5000/health`
- Headers: None
- Body: None

**cURL:**
```bash
curl -X GET http://localhost:5000/health
```

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
**Endpoint:** `POST /api/auth/register`  
**URL:** `http://localhost:5000/api/auth/register`  
**Authentication:** None required

**Postman:**
- Method: `POST`
- URL: `{{base_url}}/auth/register`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

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

**Test Result:** ✅ User created successfully, save the token and user ID

---

#### 3. User Login
**Endpoint:** `POST /api/auth/login`  
**URL:** `http://localhost:5000/api/auth/login`  
**Authentication:** None required

**Postman:**
- Method: `POST`
- URL: `{{base_url}}/auth/login`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

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

**Test Result:** ✅ Login successful, user status changed to 'active'

**Important:** Copy the token and user ID for subsequent requests!

---

#### 4. Get User Profile
**Endpoint:** `GET /api/auth/profile`  
**URL:** `http://localhost:5000/api/auth/profile`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `GET`
- URL: `{{base_url}}/auth/profile`
- Headers: `Authorization: Bearer {{token}}`
- Body: None

**cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

**Test Result:** ✅ Profile retrieved successfully

---

#### 5. Update User Profile
**Endpoint:** `PUT /api/auth/profile`  
**URL:** `http://localhost:5000/api/auth/profile`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `PUT`
- URL: `{{base_url}}/auth/profile`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Updated Test User",
  "email": "updated@example.com"
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test User",
    "email": "updated@example.com"
  }'
```

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

**Test Result:** ✅ Profile updated successfully

---

#### 6. Change Password
**Endpoint:** `PUT /api/auth/change-password`  
**URL:** `http://localhost:5000/api/auth/change-password`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `PUT`
- URL: `{{base_url}}/auth/change-password`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "password123",
    "newPassword": "newpassword123"
  }'
```

**Expected Response:**
```json
{
  "error": false,
  "message": "Password changed successfully"
}
```

**Test Result:** ✅ Password changed successfully

---

#### 7. Get All Users
**Endpoint:** `GET /api/auth/users`  
**URL:** `http://localhost:5000/api/auth/users`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `GET`
- URL: `{{base_url}}/auth/users`
- Headers: `Authorization: Bearer {{token}}`
- Body: None

**cURL:**
```bash
curl -X GET http://localhost:5000/api/auth/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

**Test Result:** ✅ All users retrieved successfully

---

#### 8. Logout User
**Endpoint:** `POST /api/auth/logout`  
**URL:** `http://localhost:5000/api/auth/logout`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `POST`
- URL: `{{base_url}}/auth/logout`
- Headers: `Authorization: Bearer {{token}}`
- Body: None

**cURL:**
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "error": false,
  "message": "Logout successful"
}
```

**Test Result:** ✅ User logged out, status changed to 'inactive'

---

### 📊 Tracking Management Endpoints

#### 9. Start Break
**Endpoint:** `POST /api/tracking/start-break`  
**URL:** `http://localhost:5000/api/tracking/start-break`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `POST`
- URL: `{{base_url}}/tracking/start-break`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "startTime": "14:30"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/tracking/start-break \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "startTime": "14:30"
  }'
```

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

**Test Result:** ✅ Break started, user status changed to 'break'

---

#### 10. Get Today's Data
**Endpoint:** `GET /api/tracking/today`  
**URL:** `http://localhost:5000/api/tracking/today`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `GET`
- URL: `{{base_url}}/tracking/today`
- Headers: `Authorization: Bearer {{token}}`
- Body: None

**cURL:**
```bash
curl -X GET http://localhost:5000/api/tracking/today \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

**Test Result:** ✅ Today's data retrieved, shows active break

---

#### 11. End Break
**Endpoint:** `POST /api/tracking/end-break`  
**URL:** `http://localhost:5000/api/tracking/end-break`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `POST`
- URL: `{{base_url}}/tracking/end-break`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "endTime": "14:45"
}
```

**cURL:**
```bash
curl -X POST http://localhost:5000/api/tracking/end-break \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "endTime": "14:45"
  }'
```

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

**Test Result:** ✅ Break ended, user status back to 'active', break duration calculated

---

#### 12. Update Work Time
**Endpoint:** `PUT /api/tracking/work-time`  
**URL:** `http://localhost:5000/api/tracking/work-time`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `PUT`
- URL: `{{base_url}}/tracking/work-time`
- Headers: 
  - `Authorization: Bearer {{token}}`
  - `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "minutes": 480
}
```

**cURL:**
```bash
curl -X PUT http://localhost:5000/api/tracking/work-time \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "minutes": 480
  }'
```

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

**Test Result:** ✅ Work time updated to 480 minutes (8 hours)

---

#### 13. Get User Statistics
**Endpoint:** `GET /api/tracking/stats`  
**URL:** `http://localhost:5000/api/tracking/stats`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `GET`
- URL: `{{base_url}}/tracking/stats?period=week`
- Headers: `Authorization: Bearer {{token}}`
- Body: None

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/tracking/stats?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

**Test Result:** ✅ Statistics retrieved successfully

---

#### 14. Get All Users (Tracking)
**Endpoint:** `GET /api/tracking/users`  
**URL:** `http://localhost:5000/api/tracking/users`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `GET`
- URL: `{{base_url}}/tracking/users`
- Headers: `Authorization: Bearer {{token}}`
- Body: None

**cURL:**
```bash
curl -X GET http://localhost:5000/api/tracking/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

**Test Result:** ✅ All users retrieved with current status

---

#### 15. Get User Monthly Data
**Endpoint:** `GET /api/tracking/user/:userId/monthly`  
**URL:** `http://localhost:5000/api/tracking/user/USER_ID/monthly`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `GET`
- URL: `{{base_url}}/tracking/user/{{userId}}/monthly?month=1&year=2025`
- Headers: `Authorization: Bearer {{token}}`
- Body: None

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/tracking/user/USER_ID/monthly?month=1&year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

**Test Result:** ✅ Monthly data retrieved successfully

---

#### 16. Get All Users Monthly Data
**Endpoint:** `GET /api/tracking/monthly`  
**URL:** `http://localhost:5000/api/tracking/monthly`  
**Authentication:** Required (Bearer token)

**Postman:**
- Method: `GET`
- URL: `{{base_url}}/tracking/monthly?month=1&year=2025`
- Headers: `Authorization: Bearer {{token}}`
- Body: None

**cURL:**
```bash
curl -X GET "http://localhost:5000/api/tracking/monthly?month=1&year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

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

**Test Result:** ✅ All users monthly data retrieved successfully

---

## 🎯 Test Scenarios

### Scenario 1: Complete User Workflow
1. Register new user
2. Login user
3. Start break
4. End break
5. Update work time
6. Get statistics
7. Logout

### Scenario 2: Multiple Users
1. Register multiple users
2. Test break management for each
3. Get all users monthly data
4. Compare statistics

### Scenario 3: Error Handling
1. Test with invalid token
2. Test with missing required fields
3. Test with invalid data formats
4. Test rate limiting

## 🚨 Error Testing

### Test Invalid Authentication
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer invalid_token"
```

Expected: `401 Unauthorized`

### Test Missing Required Fields
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User"}'
```

Expected: `400 Bad Request` with validation errors

### Test Invalid Time Format
```bash
curl -X POST http://localhost:5000/api/tracking/start-break \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"startTime": "25:70"}'
```

Expected: `400 Bad Request` with validation errors

## 🔍 Validation Testing

### Test Date Format Validation
```bash
curl -X GET "http://localhost:5000/api/tracking/today?date=invalid-date" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: `400 Bad Request` with validation errors

### Test Month/Year Validation
```bash
curl -X GET "http://localhost:5000/api/tracking/monthly?month=13&year=2025" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Expected: `400 Bad Request` with validation errors

## 📊 Performance Testing

### Test Rate Limiting
```bash
# Make multiple rapid requests
for i in {1..110}; do
  curl -X GET http://localhost:5000/api/auth/profile \
    -H "Authorization: Bearer YOUR_TOKEN_HERE"
  echo "Request $i"
done
```

Expected: After 100 requests, get `429 Too Many Requests`

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Server Not Running
**Problem:** `ECONNREFUSED` error
**Solution:** 
```bash
# From root directory (where server.js is located)
npm run dev
```

#### 2. MongoDB Connection Failed
**Problem:** `MongoServerSelectionError`
**Solution:** 
- Check if MongoDB is running
- Verify connection string in `.env`
- Test connection: `mongosh "your_connection_string"`

#### 3. JWT Token Invalid
**Problem:** `401 Unauthorized` with "Token expired"
**Solution:** 
- Login again to get new token
- Check token expiration time

#### 4. Validation Errors
**Problem:** `400 Bad Request` with field errors
**Solution:** 
- Check request body format
- Ensure all required fields are present
- Verify data types and formats

#### 5. Rate Limiting
**Problem:** `429 Too Many Requests`
**Solution:** 
- Wait for rate limit window to reset
- Reduce request frequency
- Check rate limit configuration

### Debug Mode
Enable debug logging:
```bash
DEBUG=* npm run dev
```

### Check Server Logs
```bash
npm run dev 2>&1 | tee server.log
```

## ✅ Testing Checklist

- [ ] Health check endpoint
- [ ] User registration
- [ ] User login
- [ ] Get user profile
- [ ] Update user profile
- [ ] Change password
- [ ] Get all users
- [ ] Start break
- [ ] Get today's data
- [ ] End break
- [ ] Update work time
- [ ] Get user statistics
- [ ] Get all users (tracking)
- [ ] Get user monthly data
- [ ] Get all users monthly data
- [ ] User logout
- [ ] Error handling
- [ ] Validation testing
- [ ] Rate limiting
- [ ] Performance testing

## 🎉 Success Criteria

All tests pass when:
- ✅ All 16 endpoints return expected responses
- ✅ Authentication works correctly
- ✅ Data is properly stored and retrieved
- ✅ Validation catches invalid input
- ✅ Error handling provides meaningful messages
- ✅ Rate limiting prevents abuse
- ✅ Performance meets requirements

## 📞 Support

If you encounter issues during testing:
1. Check the troubleshooting section
2. Review server logs
3. Verify environment configuration
4. Check MongoDB connection
5. Ensure all dependencies are installed
6. Verify you're running commands from the root directory

## 🚀 Quick Start Commands

```bash
# 1. Navigate to root directory (where server.js is located)
cd /path/to/your/project

# 2. Install dependencies
npm install

# 3. Create .env file
cp env.example .env
# Edit .env with your MongoDB connection

# 4. Start server
npm run dev

# 5. Test health check
curl http://localhost:5000/health

# 6. Start testing with Postman or cURL
```

---

**Happy Testing! 🧪✨**
