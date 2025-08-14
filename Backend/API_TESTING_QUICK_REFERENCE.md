# 🚀 API Testing Quick Reference Card

## 🔗 Base URL
```
http://localhost:5000/api
```

## 🏗️ Current Backend Structure
The backend is implemented in the root directory with this structure:
```
Root Directory/
├── server.js                 # Main server file
├── package.json             # Dependencies
├── .env                     # Environment variables
├── routes/                  # API route definitions
├── controllers/             # Business logic
├── models/                  # Database models
├── middleware/              # Custom middleware
└── postman_collection.json # API testing collection
```

## 🔐 Authentication Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | ❌ | Server health check |
| `/auth/register` | POST | ❌ | User registration |
| `/auth/login` | POST | ❌ | User login |
| `/auth/profile` | GET | ✅ | Get user profile |
| `/auth/profile` | PUT | ✅ | Update user profile |
| `/auth/change-password` | PUT | ✅ | Change password |
| `/auth/logout` | POST | ✅ | User logout |
| `/auth/users` | GET | ✅ | Get all users |

## 📊 Tracking Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/tracking/start-break` | POST | ✅ | Start a break |
| `/tracking/end-break` | POST | ✅ | End a break |
| `/tracking/today` | GET | ✅ | Get today's data |
| `/tracking/stats` | GET | ✅ | Get user statistics |
| `/tracking/work-time` | PUT | ✅ | Update work time |
| `/tracking/users` | GET | ✅ | Get all users with status |
| `/tracking/user/:userId/monthly` | GET | ✅ | Get user monthly data |
| `/tracking/monthly` | GET | ✅ | Get all users monthly data |

## 🧪 Quick Test Commands

### 1. Health Check
```bash
curl http://localhost:5000/health
```

### 2. Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "email": "test@example.com", "password": "password123"}'
```

### 3. Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'
```

### 4. Start Break (with token)
```bash
curl -X POST http://localhost:5000/api/tracking/start-break \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"startTime": "14:30"}'
```

### 5. End Break (with token)
```bash
curl -X POST http://localhost:5000/api/tracking/end-break \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"endTime": "14:45"}'
```

### 6. Get Today's Data (with token)
```bash
curl -X GET http://localhost:5000/api/tracking/today \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 7. Update Work Time (with token)
```bash
curl -X PUT http://localhost:5000/api/tracking/work-time \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"minutes": 480}'
```

### 8. Get Statistics (with token)
```bash
curl -X GET "http://localhost:5000/api/tracking/stats?period=week" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📝 Test Data Examples

### User Registration
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Start Break
```json
{
  "startTime": "14:30"
}
```

### End Break
```json
{
  "endTime": "14:45"
}
```

### Update Work Time
```json
{
  "minutes": 480
}
```

### Update Profile
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

### Change Password
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword123"
}
```

## 🔍 Query Parameters

### Date Queries
- `date`: YYYY-MM-DD format
- `month`: 1-12 (month number)
- `year`: 2020-2030 (year number)

### Period Queries
- `period`: 'week', 'month', or 'year'

### Examples
```
GET /tracking/today?date=2025-01-20
GET /tracking/stats?period=month
GET /tracking/monthly?month=1&year=2025
```

## 🚨 Common HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Validation error or invalid data |
| 401 | Unauthorized | Missing or invalid authentication |
| 404 | Not Found | Resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Server health check
- [ ] User registration
- [ ] User login
- [ ] JWT token generation

### Authentication
- [ ] Protected route access with valid token
- [ ] Protected route rejection without token
- [ ] Invalid token handling

### Tracking Features
- [ ] Start break
- [ ] End break
- [ ] Work time updates
- [ ] Data retrieval

### Data Validation
- [ ] Required field validation
- [ ] Format validation (time, date)
- [ ] Data type validation

### Error Handling
- [ ] Invalid input handling
- [ ] Missing field handling
- [ ] Rate limiting

## 🚀 Quick Start Testing

1. **Navigate to root directory** (where server.js is located)
2. **Install dependencies**: `npm install`
3. **Create .env file**: `cp env.example .env`
4. **Configure environment variables** (MongoDB connection, JWT secret)
5. **Start server**: `npm run dev`
6. **Test health check**: `curl http://localhost:5000/health`
7. **Start testing**: Use Postman collection or cURL commands

## 📱 Postman Tips

1. **Import Collection**: Use `postman_collection.json` from root directory
2. **Environment Variables**: Set `base_url` and `token`
3. **Auto-save Token**: Use the test script to auto-save tokens
4. **Collection Runner**: Test multiple endpoints in sequence
5. **Environment Switching**: Test different environments easily

## 🔧 Environment Setup

### Required Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/employee-tracking
JWT_SECRET=your-super-secret-jwt-key-for-testing
PORT=5000
NODE_ENV=development
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Server Commands
```bash
# From root directory (where server.js is located)
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server
```

## 📊 All 16 API Endpoints

### Authentication (8 endpoints)
1. `GET /health` - Health check
2. `POST /api/auth/register` - User registration
3. `POST /api/auth/login` - User login
4. `GET /api/auth/profile` - Get profile
5. `PUT /api/auth/profile` - Update profile
6. `PUT /api/auth/change-password` - Change password
7. `GET /api/auth/users` - Get all users
8. `POST /api/auth/logout` - User logout

### Tracking (8 endpoints)
9. `POST /api/tracking/start-break` - Start break
10. `POST /api/tracking/end-break` - End break
11. `GET /api/tracking/today` - Get today's data
12. `GET /api/tracking/stats` - Get statistics
13. `PUT /api/tracking/work-time` - Update work time
14. `GET /api/tracking/users` - Get all users with status
15. `GET /api/tracking/user/:userId/monthly` - Get user monthly data
16. `GET /api/tracking/monthly` - Get all users monthly data

## 🎯 Testing Success Criteria

All tests pass when:
- ✅ All 16 endpoints return expected responses
- ✅ Authentication works correctly
- ✅ Data is properly stored and retrieved
- ✅ Validation catches invalid input
- ✅ Error handling provides meaningful messages
- ✅ Rate limiting prevents abuse
- ✅ Performance meets requirements

---

**Happy Testing! 🎯**
