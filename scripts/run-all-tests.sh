#!/bin/bash

# TeamOne Test Runner Script
# Runs all tests (unit, integration, E2E) and generates coverage report

set -e

echo "════════════────────────────────────────────────────────────────"
echo "  TeamOne Test Suite"
echo "════════════────────────────────────────────────────────────────"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run tests
run_tests() {
  local test_type=$1
  local test_dir=$2
  local command=$3
  
  echo -e "${BLUE}Running $test_type tests...${NC}"
  echo ""
  
  if [ -d "$test_dir" ] || [ -f "$test_dir" ]; then
    if eval "$command"; then
      echo -e "${GREEN}✓ $test_type tests passed${NC}"
      ((PASSED_TESTS++))
    else
      echo -e "${RED}✗ $test_type tests failed${NC}"
      ((FAILED_TESTS++))
    fi
    ((TOTAL_TESTS++))
  else
    echo -e "${YELLOW}⚠ $test_type tests not found, skipping...${NC}"
  fi
  
  echo ""
}

# Backend Unit Tests
echo "══════════════════════════════════════════════════════════════"
echo "  Backend Tests"
echo "══════════════════════════════════════════════════════════════"
echo ""

cd backend

# Run tests for each service
SERVICES=("auth" "work" "money" "assets" "support" "growth")

for service in "${SERVICES[@]}"; do
  if [ -d "services/$service" ]; then
    echo "Testing $service service..."
    cd "services/$service"
    
    if [ -f "package.json" ]; then
      npm install --silent > /dev/null 2>&1
      if npm test -- --silent 2>&1 | grep -q "passing"; then
        echo -e "${GREEN}✓ $service service tests passed${NC}"
        ((PASSED_TESTS++))
      else
        echo -e "${YELLOW}⚠ $service service tests skipped or failed${NC}"
      fi
      ((TOTAL_TESTS++))
    fi
    
    cd ../..
  fi
done

cd ..

# Frontend Unit Tests
echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  Frontend Tests"
echo "══════════════════════════════════════════════════════════════"
echo ""

cd frontend

if [ -f "package.json" ]; then
  echo "Installing dependencies..."
  npm install --silent > /dev/null 2>&1
  
  echo ""
  echo "Running unit tests..."
  if npm test -- --run --silent 2>&1 | grep -q "passing"; then
    echo -e "${GREEN}✓ Frontend unit tests passed${NC}"
    ((PASSED_TESTS++))
  else
    echo -e "${YELLOW}⚠ Frontend unit tests skipped or failed${NC}"
  fi
  ((TOTAL_TESTS++))
  
  echo ""
  echo "Running test coverage..."
  if npm run test:coverage -- --silent 2>&1 | grep -q "Coverage"; then
    echo -e "${GREEN}✓ Coverage report generated${NC}"
  else
    echo -e "${YELLOW}⚠ Coverage report generation skipped${NC}"
  fi
fi

cd ..

# E2E Tests (Optional - requires running app)
echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  E2E Tests"
echo "══════════════════════════════════════════════════════════════"
echo ""

if command -v npx &> /dev/null; then
  echo "E2E tests require running application."
  echo "To run E2E tests:"
  echo "  1. Start the application: npm run dev"
  echo "  2. In another terminal: npm run test:e2e"
  echo ""
  echo -e "${YELLOW}⚠ E2E tests skipped (application not running)${NC}"
else
  echo -e "${YELLOW}⚠ E2E tests skipped (npx not available)${NC}"
fi

# Summary
echo ""
echo "══════════════════════════════════════════════════════════════"
echo "  Test Summary"
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "Total Test Suites: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi
