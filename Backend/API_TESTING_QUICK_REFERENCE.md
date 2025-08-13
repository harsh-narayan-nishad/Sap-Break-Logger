# 🚀 API Testing Quick Reference Card

## 🔗 Base URL
```
http://localhost:5000/api
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

1. **Start server**: `npm run dev`
2. **Health check**: `curl http://localhost:5000/health`
3. **Register user**: Use registration endpoint
4. **Login user**: Get JWT token
5. **Test tracking**: Use token for protected endpoints
6. **Verify data**: Check responses and database

## 📱 Postman Tips

1. **Environment Variables**: Set `base_url` and `token`
2. **Auto-save Token**: Use the test script to auto-save tokens
3. **Collection Runner**: Test multiple endpoints in sequence
4. **Environment Switching**: Test different environments easily

---

**Happy Testing! 🎯**
