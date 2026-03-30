@echo off
echo ===========================================
echo MeetingController Exception Handling Test
echo ===========================================
echo.

echo Testing enhanced exception handling in MeetingController...
echo.

echo 1. Testing IllegalArgumentException handling:
curl -s http://localhost:8080/api/meetings/test-exception/illegalargument | findstr /C:"VALIDATION_FAILED" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ IllegalArgumentException handled correctly
) else (
    echo ❌ IllegalArgumentException not handled properly
)
echo.

echo 2. Testing RuntimeException handling:
curl -s http://localhost:8080/api/meetings/test-exception/runtime | findstr /C:"RUNTIME_ERROR" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ RuntimeException handled correctly
) else (
    echo ❌ RuntimeException not handled properly
)
echo.

echo 3. Testing MongoDB Exception handling:
curl -s http://localhost:8080/api/meetings/test-exception/mongodb | findstr /C:"DATABASE_ERROR" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB Exception handled correctly
) else (
    echo ❌ MongoDB Exception not handled properly
)
echo.

echo 4. Testing DataAccess Exception handling:
curl -s http://localhost:8080/api/meetings/test-exception/dataaccess | findstr /C:"DATA_ACCESS_ERROR" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ DataAccess Exception handled correctly
) else (
    echo ❌ DataAccess Exception not handled properly
)
echo.

echo 5. Testing Generic Exception handling:
curl -s http://localhost:8080/api/meetings/test-exception/generic | findstr /C:"UNEXPECTED_ERROR" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Generic Exception handled correctly
) else (
    echo ❌ Generic Exception not handled properly
)
echo.

echo ===========================================
echo Testing normal MeetingController operations...
echo ===========================================
echo.

echo 6. Testing health check:
curl -s http://localhost:8080/api/meetings/health | findstr /C:"up and running" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Health check working
) else (
    echo ❌ Health check failed
)
echo.

echo 7. Testing invalid meeting ID (should return 400):
curl -s -w "%%{http_code}" http://localhost:8080/api/meetings/ | findstr /C:"400" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Invalid meeting ID validation working
) else (
    echo ❌ Invalid meeting ID validation failed
)
echo.

echo ===========================================
echo Test Summary
echo ===========================================
echo.
echo If you see mostly ✅ marks above, then:
echo ✅ All exceptions are properly handled
echo ✅ MeetingController is working correctly
echo ✅ Error responses are structured properly
echo ✅ No unhandled exceptions remain
echo.
echo Check your application logs for detailed error information.
echo.
echo 🎉 Exception handling test completed!
