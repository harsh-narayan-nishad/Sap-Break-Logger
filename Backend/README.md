# Employee Tracking System Backend 🚀

A production-level backend API for the employee tracking system built with Express.js, MongoDB, and JWT authentication. This backend is specifically designed to work with the React frontend tracking system.

## 🏗️ Architecture

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors, rate limiting
- **Error Handling**: Custom error handling middleware

## 📁 Project Structure

```
Backend/
├── models/                 # Database models
│   ├── User.js            # User schema with tracking status
│   └── DayRecord.js       # Daily tracking records
├── controllers/            # Business logic
│   ├── authController.js   # Authentication operations
│   └── trackingController.js # Tracking operations
├── routes/                 # API route definitions
│   ├── auth.js            # Authentication routes
│   └── tracking.js        # Tracking management routes
├── middleware/             # Custom middleware
│   ├── auth.js            # JWT authentication
│   ├── errorHandler.js    # Error handling
│   └── validation.js      # Request validation
├── server.js              # Main server file
├── package.json           # Dependencies and scripts
├── env.example            # Environment variables template
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment setup**
   ```bash
   # Copy the environment template
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

3. **Configure environment variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/employee-tracking
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000` (or your configured PORT).

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `MONGODB_URI` | MongoDB connection string | - | ✅ |
| `JWT_SECRET` | Secret key for JWT tokens | - | ✅ |
| `PORT` | Server port number | 5000 | ❌ |
| `NODE_ENV` | Environment (development/production) | development | ❌ |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window in milliseconds | 900000 (15 min) | ❌ |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 | ❌ |

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "error": false,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "inactive",
      "dailyWorkTime": 0,
      "createdAt": "2025-01-20T10:00:00.000Z",
      "updatedAt": "2025-01-20T10:00:00.000Z"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "error": false,
  "message": "Login successful",
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  }
}
```

### Tracking Management Endpoints

**Note**: All tracking endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Start Break
```http
POST /tracking/start-break
Authorization: Bearer <token>
Content-Type: application/json

{
  "startTime": "14:30"
}
```

#### End Break
```http
POST /tracking/end-break
Authorization: Bearer <token>
Content-Type: application/json

{
  "endTime": "14:45"
}
```

#### Get Today's Data
```http
GET /tracking/today
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` (optional): Specific date in YYYY-MM-DD format

#### Get Monthly Data for User
```http
GET /tracking/user/:userId/monthly
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year number

#### Get All Users Monthly Data
```http
GET /tracking/monthly
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year number

#### Get User Statistics
```http
GET /tracking/stats
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): 'week', 'month', or 'year' (default: 'week')

#### Update Work Time
```http
PUT /tracking/work-time
Authorization: Bearer <token>
Content-Type: application/json

{
  "minutes": 480
}
```

#### Get All Users
```http
GET /tracking/users
Authorization: Bearer <token>
```

## 🧪 Testing with Postman

1. **Import the collection**: Use the provided Postman collection
2. **Set environment variables**:
   - `base_url`: `http://localhost:5000/api`
   - `token`: (will be auto-filled after login)
3. **Test flow**:
   - Register → Login → Use token for protected endpoints

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs with salt rounds
- **Input Validation**: express-validator for request validation
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for Express
- **Error Handling**: Secure error responses (no sensitive data in production)

## 📊 Data Models

### User Schema
```javascript
{
  name: String (required),
  email: String (unique, required),
  password: String (hashed, required),
  avatar: String (optional),
  status: 'active' | 'break' | 'inactive',
  currentBreakStart: Date (optional),
  dailyWorkTime: Number (minutes),
  lastActiveDate: Date,
  timestamps: true
}
```

### DayRecord Schema
```javascript
{
  userId: ObjectId (ref: User),
  date: String (YYYY-MM-DD format),
  workTime: Number (minutes),
  breaks: Array of break objects,
  totalBreakTime: Number (minutes),
  status: 'active' | 'break' | 'inactive' | 'completed',
  lastActivity: Date,
  timestamps: true
}
```

### Break Record Schema
```javascript
{
  start: String (HH:mm format),
  end: String (HH:mm format, optional),
  duration: Number (minutes)
}
```

## 🔄 Frontend Integration

This backend is designed to work seamlessly with the React frontend tracking system:

- **User Management**: Matches frontend User interface
- **Break Tracking**: Supports start/end break functionality
- **Work Time**: Tracks daily work time in minutes
- **Monthly Data**: Provides calendar view data
- **Real-time Status**: User status updates (active/break/inactive)
- **Statistics**: Period-based analytics (week/month/year)

## 🚀 Production Deployment

### 1. Environment Setup
```bash
NODE_ENV=production
JWT_SECRET=very-long-random-secret-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

### 2. Process Management
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name "employee-tracking-backend"

# Monitor
pm2 monit

# Restart
pm2 restart employee-tracking-backend
```

### 3. Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running
   - Verify connection string in `.env`
   - Ensure network access (for cloud instances)

2. **JWT Token Invalid**
   - Check if token is expired
   - Verify `JWT_SECRET` in environment
   - Ensure proper Authorization header format

3. **Validation Errors**
   - Check request body format
   - Verify required fields
   - Ensure proper data types

### Debug Mode
```bash
# Enable debug logging
DEBUG=* npm run dev

# Check server logs
npm run dev 2>&1 | tee server.log
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the API documentation

---

**Happy Tracking! 🎯**
