@echo off
echo Testing Event Info Demo Public API...
echo.

echo 1. Testing without API key (should fail)...
curl -s http://localhost:5000/api/public/events
echo.
echo.

echo 2. Testing with invalid API key (should fail)...
curl -s -H "x-api-key: invalid" http://localhost:5000/api/public/events
echo.
echo.

echo 3. Testing with valid API key (should succeed)...
curl -s -H "x-api-key: 12345" http://localhost:5000/api/public/events
echo.
echo.

echo 4. Testing single event with valid API key (should succeed)...
curl -s -H "x-api-key: 12345" http://localhost:5000/api/public/events/1
echo.
echo.

echo Testing completed!
pause
