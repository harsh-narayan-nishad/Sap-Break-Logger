#!/bin/bash

# Employee Tracking System API Testing Script
# This script helps test the basic API functionality

echo "🧪 Employee Tracking System API Testing Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Base URL
BASE_URL="http://localhost:5000"
API_URL="$BASE_URL/api"

# Test counter
PASSED=0
FAILED=0

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC} - $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC} - $2"
        ((FAILED++))
    fi
}

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    local headers=$5
    local data=$6
    
    echo -e "\n${BLUE}Testing: $description${NC}"
    echo "Endpoint: $method $endpoint"
    
    if [ -n "$data" ]; then
        echo "Data: $data"
    fi
    
    # Make the request
    if [ -n "$data" ]; then
        response=$(curl -s -w "%{http_code}" -X $method "$endpoint" $headers -d "$data")
    else
        response=$(curl -s -w "%{http_code}" -X $method "$endpoint" $headers)
    fi
    
    # Extract status code and body
    status_code="${response: -3}"
    body="${response%???}"
    
    echo "Status Code: $status_code"
    echo "Response: $body"
    
    # Check if status code matches expected
    if [ "$status_code" -eq "$expected_status" ]; then
        print_result 0 "$description"
    else
        print_result 1 "$description (Expected: $expected_status, Got: $status_code)"
    fi
}

# Check if server is running
echo -e "\n${YELLOW}Checking if server is running...${NC}"
if curl -s "$BASE_URL/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server is running${NC}"
else
    echo -e "${RED}❌ Server is not running. Please start the server first:${NC}"
    echo "npm run dev"
    exit 1
fi

echo -e "\n${YELLOW}Starting API tests...${NC}"

# Test 1: Health Check
test_endpoint "GET" "$BASE_URL/health" 200 "Health Check"

# Test 2: User Registration
test_endpoint "POST" "$API_URL/auth/register" 201 "User Registration" \
    "-H 'Content-Type: application/json'" \
    '{"name": "Test User", "email": "test@example.com", "password": "password123"}'

# Test 3: User Login
test_endpoint "POST" "$API_URL/auth/login" 200 "User Login" \
    "-H 'Content-Type: application/json'" \
    '{"email": "test@example.com", "password": "password123"}'

# Test 4: Get Profile (without token - should fail)
test_endpoint "GET" "$API_URL/auth/profile" 401 "Get Profile (Unauthorized)"

# Test 5: Invalid endpoint
test_endpoint "GET" "$API_URL/invalid" 404 "Invalid Endpoint"

echo -e "\n${YELLOW}Test Summary${NC}"
echo "============="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo -e "Total: $((PASSED + FAILED))"

if [ $FAILED -eq 0 ]; then
    echo -e "\n${GREEN}🎉 All tests passed!${NC}"
else
    echo -e "\n${RED}⚠️  Some tests failed. Check the output above.${NC}"
fi

echo -e "\n${BLUE}Next Steps:${NC}"
echo "1. Copy the JWT token from the login response"
echo "2. Use Postman collection for comprehensive testing"
echo "3. Test all 16 endpoints systematically"
echo "4. Verify database operations"

echo -e "\n${YELLOW}For complete testing, use the Postman collection:${NC}"
echo "File: postman_collection.json"
echo "Import into Postman and set up environment variables"
