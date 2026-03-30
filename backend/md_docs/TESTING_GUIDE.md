# Integration Testing Guide for MeetingController

## 🧪 Quick Test Guide

### Prerequisites
- ✅ Spring Boot application running on `http://localhost:8080`
- ✅ MongoDB connection configured
- ✅ Postman or cURL installed

---

## Test 1: Health Check ✅
**Verify the controller is accessible**

```bash
curl -X GET http://localhost:8080/api/meetings/health
```

**Expected Response:**
```
Meeting Controller is up and running ✅
```

---

## Test 2: Process Meeting (Simple) ✅
**Submit a basic transcript**

```bash
curl -X POST http://localhost:8080/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "In todays meeting, we discussed the project timeline. John will prepare the requirements document by Friday. Sarah needs to create the design mockups."
  }'
```

**Expected Response (200 OK):**
```json
{
  "meeting_id": "UUID_HERE",
  "meeting_title": "Meeting 2026-03-28T...",
  "transcript": "In todays meeting...",
  "created_at": "2026-03-28T18:23:36.345",
  "summary": "Project timeline discussion with task assignments",
  "tasks_extracted": 2,
  "tasks": [
    {
      "task_id": "UUID",
      "title": "Prepare requirements document",
      "owner": "John",
      "deadline": "2026-03-31T...",
      "status": "PENDING",
      "reminder_sent": false,
      "escalated": false
    }
  ],
  "status": "SUCCESS",
  "message": "Meeting processed successfully",
  "processed_at": "2026-03-28T18:23:45.135"
}
```

---

## Test 3: Error Handling (Empty Transcript) ❌
**Verify error handling for invalid input**

```bash
curl -X POST http://localhost:8080/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{"transcript": ""}'
```

**Expected Response (400 Bad Request):**
```json
{
  "status": "FAILED",
  "message": "Transcript cannot be empty",
  "tasks_extracted": 0,
  "tasks": [],
  "processed_at": "2026-03-28T18:23:45.135"
}
```

---

## Test 4: Get Meeting by ID 📖
**After processing a meeting, retrieve it using the ID**

```bash
# First, get the meeting_id from Test 2 response
MEETING_ID="507f1f77bcf86cd799439011"

curl -X GET http://localhost:8080/api/meetings/$MEETING_ID
```

**Expected Response (200 OK):**
```json
{
  "meeting_id": "507f1f77bcf86cd799439011",
  "meeting_title": "Meeting 2026-03-28T...",
  "created_at": "2026-03-28T18:23:36.345",
  "summary": "...",
  "tasks_extracted": 2,
  "tasks": [...],
  "status": "SUCCESS",
  "processed_at": "2026-03-28T18:23:45.135"
}
```

---

## Test 5: MongoDB Connection Issue (Current Issue) 🔴
**This is the error you're currently seeing:**

```
com.mongodb.MongoSocketException: No such host is known 
(taskpilotcluster-shard-00-00.fyt7sos.mongodb.net)
```

### Root Causes:
1. ❌ Network connectivity issue
2. ❌ MongoDB Atlas IP whitelist missing your IP
3. ❌ DNS resolution problem
4. ❌ MongoDB Atlas cluster down

### Solution Steps:
1. **Check MongoDB Atlas:**
   - Go to https://cloud.mongodb.com
   - Select your cluster: `taskpilotcluster`
   - Click "Network Access"
   - Verify your IP is whitelisted (or add `0.0.0.0/0` for development)

2. **Verify Connection String:**
   ```
   mongodb+srv://aditi02_db_user:1xHUJPYnNrAfvs5F@taskpilotcluster.fyt7sos.mongodb.net/taskpilot?retryWrites=true&w=majority
   ```

3. **Test Connectivity:**
   ```bash
   # Using PowerShell
   Test-NetConnection -ComputerName taskpilotcluster-shard-00-00.fyt7sos.mongodb.net -Port 27017
   ```

4. **Restart Application:**
   - Stop the Spring Boot app
   - Fix the connection issue
   - Restart the app

---

## Postman Collection (Import This)

```json
{
  "info": {
    "name": "TaskPilot Meeting API",
    "version": "1.0"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/meetings/health"
      }
    },
    {
      "name": "Process Meeting",
      "request": {
        "method": "POST",
        "url": "http://localhost:8080/api/meetings/process",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"transcript\": \"In this meeting we discussed Q1 roadmap. John will prepare budget by Friday. Sarah handles marketing.\"\n}"
        }
      }
    },
    {
      "name": "Get Meeting",
      "request": {
        "method": "GET",
        "url": "http://localhost:8080/api/meetings/507f1f77bcf86cd799439011"
      }
    }
  ]
}
```

---

## 🔍 Logging Output to Verify

When you run Test 2, you should see logs like:

```
📩 Incoming transcript request
🔥 MEETING CONTROLLER EXECUTING - Transcript length: 245 characters
✅ Meeting processed successfully - Meeting ID: 507f1f77bcf86cd799439011, Tasks extracted: 2
```

---

## ✅ Verification Checklist

- [ ] Health check returns 200 OK
- [ ] Process meeting returns 200 OK with valid response structure
- [ ] Empty transcript returns 400 error
- [ ] Meeting can be retrieved by ID
- [ ] MongoDB connection is working
- [ ] No compilation errors
- [ ] Logs show correct flow

---

## 🚀 Next Steps

Once all tests pass:

1. **Integrate with Frontend:**
   - Add meeting processing UI
   - Display extracted tasks
   - Allow task management

2. **Add More Endpoints:**
   - DELETE /api/meetings/{id}
   - PUT /api/meetings/{id} (update)
   - GET /api/meetings (list all)

3. **Performance Optimization:**
   - Add pagination for meetings list
   - Add caching for frequently accessed meetings
   - Implement async processing for large transcripts

4. **Enhanced Features:**
   - Task filtering and search
   - Meeting analytics
   - Task completion tracking

