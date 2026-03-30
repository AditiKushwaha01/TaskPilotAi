@echo off
echo ========================================
echo GlobalExceptionHandler Test Script
echo ========================================
echo.

echo Testing GlobalExceptionHandler functionality...
echo.

echo 1. Testing IllegalArgumentException (400):
curl -s http://localhost:8080/api/meetings/test-exception/illegalargument | jq .status 2>nul || curl -s http://localhost:8080/api/meetings/test-exception/illegalargument
echo.

echo 2. Testing RuntimeException (500):
curl -s http://localhost:8080/api/meetings/test-exception/runtime | jq .status 2>nul || curl -s http://localhost:8080/api/meetings/test-exception/runtime
echo.

echo 3. Testing MongoDB Exception (500):
curl -s http://localhost:8080/api/meetings/test-exception/mongodb | jq .status 2>nul || curl -s http://localhost:8080/api/meetings/test-exception/mongodb
echo.

echo 4. Testing DataAccess Exception (500):
curl -s http://localhost:8080/api/meetings/test-exception/dataaccess | jq .status 2>nul || curl -s http://localhost:8080/api/meetings/test-exception/dataaccess
echo.

echo 5. Testing Generic Exception (500):
curl -s http://localhost:8080/api/meetings/test-exception/generic | jq .status 2>nul || curl -s http://localhost:8080/api/meetings/test-exception/generic
echo.

echo ========================================
echo Check your application logs for:
echo - Request context in error messages
echo - Proper exception handling
echo - MeetingProcessResponse format
echo ========================================
echo.
echo If you see proper JSON responses with status codes,
echo then GlobalExceptionHandler is WORKING! ✅
echo.
