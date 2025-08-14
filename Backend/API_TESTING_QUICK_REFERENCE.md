# 🚀 API Testing Quick Reference Card - Postman Focused

## 🔗 Base URL
```
http://localhost:5001/api
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

## 🐘 Postman Setup

### 1. Install Postman
- **Desktop App**: [postman.com/downloads](https://postman.com/downloads/)
- **Web Version**: [web.postman.com](https://web.postman.com/)

### 2. Import Collection
1. Click **"Import"** in Postman
2. Select `postman_collection.json` from root directory
3. Collection will be imported with all 16 endpoints

### 3. Environment Setup
Create environment: `Employee Tracking System - Local`

| Variable | Initial Value | Description |
|----------|---------------|-------------|
| `base_url` | `http://localhost:5001/api` | Base API URL |
| `token` | `` | JWT authentication token |
| `userId` | `` | Current user ID for testing |
| `userEmail` | `test@example.com` | Test user email |
| `userPassword` | `password123` | Test user password |
| `server_url` | `http://localhost:5001` | Server base URL |

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

## 🧪 Postman Testing Workflow

### Phase 1: Setup
1. **Import Collection** → `postman_collection.json`
2. **Create Environment** → Set variables
3. **Health Check** → Verify server running

### Phase 2: Authentication
1. **Register User** → Get user ID and token
2. **Login User** → Verify token generation
3. **Test Protected Routes** → Use saved token

### Phase 3: Core Testing
1. **Profile Management** → Test CRUD operations
2. **Break Tracking** → Test start/end functionality
3. **Data Retrieval** → Test all GET endpoints

### Phase 4: Advanced Testing
1. **Error Scenarios** → Test validation
2. **Edge Cases** → Test boundaries
3. **Performance** → Test response times

## 📝 Test Data Examples

### User Registration
```json
{
  "name": "John Doe",
  "email": "{{userEmail}}",
  "password": "{{userPassword}}"
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
  "currentPassword": "{{userPassword}}",
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

## 🧪 Postman Testing Checklist

### Basic Setup
- [ ] Postman installed and running
- [ ] Collection imported successfully
- [ ] Environment created and selected
- [ ] Server running on localhost:5001

### Authentication Testing
- [ ] Health check working
- [ ] User registration successful
- [ ] User login successful
- [ ] JWT token auto-saved
- [ ] Protected routes accessible

### Core Functionality
- [ ] Profile management working
- [ ] Break tracking working
- [ ] Work time updates working
- [ ] Data retrieval working

### Advanced Features
- [ ] Error handling tested
- [ ] Validation rules tested
- [ ] Test scripts executing
- [ ] Environment variables working

## 🎯 Postman Testing Tips

### 1. Use Environment Variables
- Never hardcode URLs or tokens
- Use `{{variable_name}}` syntax
- Set initial values for testing

### 2. Test Scripts
```javascript
// Auto-save important data
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.data.token);
    pm.environment.set("userId", response.data.user.id);
}

// Validate responses
pm.test("Response is successful", function () {
    const response = pm.response.json();
    pm.expect(response.error).to.be.false;
});
```

### 3. Collection Runner
- Test multiple endpoints in sequence
- Set delays between requests
- Monitor success rates

### 4. Pre-request Scripts
```javascript
// Set up data before request
pm.environment.set("timestamp", new Date().toISOString());
```

## 🚀 Quick Start Postman Testing

1. **Start server**: `npm run dev`
2. **Open Postman**: Desktop app or web version
3. **Import collection**: `postman_collection.json`
4. **Create environment**: Set variables
5. **Start testing**: Health check → Register → Login → Test all endpoints

## 📱 Postman Features to Use

### Collections
- Group related API requests
- Organize by functionality
- Share with team members

### Environments
- Store variables for different setups
- Switch between local/dev/prod
- Keep sensitive data secure

### Tests
- Automate response validation
- Auto-save important data
- Ensure API consistency

### Pre-request Scripts
- Set up data before requests
- Generate dynamic values
- Prepare authentication

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

All Postman tests pass when:
- ✅ All 16 endpoints return expected responses
- ✅ Environment variables work correctly
- ✅ Test scripts execute without errors
- ✅ Authentication flows work properly
- ✅ Data validation catches errors
- ✅ Error handling provides meaningful messages
- ✅ Performance meets requirements

## 🐛 Common Postman Issues

### Environment Variables Not Working
- Verify environment is selected
- Check variable names match exactly
- Use `{{variable_name}}` syntax

### Tests Not Running
- Check "Tests" tab in request
- Verify JavaScript syntax
- Check Postman console for errors

### Collection Import Issues
- Verify JSON file format
- Check Postman version compatibility
- Try importing individual requests

### Authentication Problems
- Verify token format in Authorization header
- Check token expiration
- Ensure token is saved in environment

## 📞 Support

If you encounter issues:
1. Check troubleshooting section
2. Verify environment configuration
3. Check Postman console for errors
4. Ensure backend server is running
5. Verify MongoDB connection

---

**Happy Postman Testing! 🎯**
