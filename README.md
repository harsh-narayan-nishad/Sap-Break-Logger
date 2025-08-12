# Break Tracking Backend 🚀

A production-level backend API for a break-tracking application built with Express.js, MongoDB, and JWT authentication.

## 🏗️ Architecture

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors, rate limiting
- **Error Handling**: Custom error handling middleware

## 📁 Project Structure

```
break-tracking-backend/
├── models/                 # Database models
│   ├── User.js            # User schema and methods
│   └── Break.js           # Break tracking schema
├── controllers/            # Business logic
│   ├── authController.js   # Authentication operations
│   └── breakController.js  # Break management operations
├── routes/                 # API route definitions
│   ├── auth.js            # Authentication routes
│   └── breaks.js          # Break management routes
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

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd break-tracking-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   # Copy the environment template
   cp env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Configure environment variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/break-tracking
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

5. **Start the server**
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

### MongoDB Setup

1. **Local MongoDB**
   ```bash
   # Install MongoDB locally
   brew install mongodb-community  # macOS
   sudo apt-get install mongodb    # Ubuntu
   
   # Start MongoDB service
   brew services start mongodb-community  # macOS
   sudo systemctl start mongod            # Ubuntu
   ```

2. **MongoDB Atlas (Cloud)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get connection string and update `MONGODB_URI`

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
  "username": "john_doe",
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
      "username": "john_doe",
      "email": "john@example.com",
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

### Break Management Endpoints

**Note**: All break endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Start Break
```http
POST /breaks/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-01-20",
  "startTime": "14:30"
}
```

#### End Break
```http
POST /breaks/end
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "2025-01-20",
  "endTime": "14:45"
}
```

#### Get Today's Data
```http
GET /breaks/today
Authorization: Bearer <token>
```

**Query Parameters:**
- `date` (optional): Specific date in YYYY-MM-DD format

#### Get Monthly Data for User
```http
GET /breaks/user/:userId/monthly
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year number

#### Get All Users Monthly Data
```http
GET /breaks/monthly
Authorization: Bearer <token>
```

**Query Parameters:**
- `month` (optional): Month number (1-12)
- `year` (optional): Year number

#### Get User Statistics
```http
GET /breaks/stats
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` (optional): 'week', 'month', or 'year' (default: 'week')

## 🧪 Testing with Postman

### 1. Import Collection
Download the Postman collection from the project or create your own with the endpoints above.

### 2. Test Flow

1. **Register a new user**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/register`
   - Body: JSON with username, email, and password

2. **Login to get token**
   - Method: `POST`
   - URL: `http://localhost:5000/api/auth/login`
   - Body: JSON with email and password
   - Copy the token from the response

3. **Use token for authenticated requests**
   - Add header: `Authorization: Bearer <your_token>`
   - Test break endpoints

### 3. Environment Variables in Postman
Create a Postman environment with:
- `base_url`: `http://localhost:5000/api`
- `token`: Your JWT token after login

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
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date,
  updatedAt: Date
}
```

### Break Schema
```javascript
{
  userId: ObjectId (ref: User),
  date: Date (required),
  startTime: String (HH:mm format),
  endTime: String (HH:mm format, optional),
  workTime: Number (minutes),
  totalBreakDuration: Number (minutes),
  status: String (Active/On Break/Completed),
  breaks: Array of break objects
}
```

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
pm2 start server.js --name "break-tracking-backend"

# Monitor
pm2 monit

# Restart
pm2 restart break-tracking-backend
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

**Happy Coding! 🎉**
