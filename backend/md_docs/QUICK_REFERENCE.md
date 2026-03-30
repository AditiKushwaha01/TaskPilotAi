# 🎯 MeetingController - Quick Reference Card

## API Endpoints at a Glance

```
POST   /api/meetings/process       → Process meeting transcript
GET    /api/meetings/{id}          → Get meeting details
GET    /api/meetings/health        → Health check
```

---

## 🚀 Quick Start (Copy-Paste Ready)

### Test 1: Health Check
```bash
curl http://localhost:8080/api/meetings/health
```

### Test 2: Process Meeting
```bash
curl -X POST http://localhost:8080/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{"transcript":"In the meeting, John will prepare the report by Friday."}'
```

### Test 3: Get Meeting
```bash
curl http://localhost:8080/api/meetings/MEETING_ID_HERE
```

---

## 📦 Request & Response

### Request Format
```json
{
  "transcript": "Meeting transcript text here..."
}
```

### Success Response (200)
```json
{
  "meeting_id": "507f1f77bcf86cd799439011",
  "meeting_title": "Meeting 2026-03-28...",
  "tasks_extracted": 3,
  "tasks": [
    {
      "task_id": "...",
      "title": "Task name",
      "owner": "Person name",
      "status": "PENDING"
    }
  ],
  "status": "SUCCESS",
  "message": "Meeting processed successfully"
}
```

### Error Response (400/500)
```json
{
  "status": "FAILED",
  "message": "Error description here"
}
```

---

## 🧪 Common Test Cases

| Test | Command | Expected |
|------|---------|----------|
| Health | `GET /health` | 200 OK |
| Valid Transcript | `POST /process` | 200 OK + tasks |
| Empty Transcript | `POST /process {"transcript":""}` | 400 error |
| Invalid JSON | `POST /process {invalid}` | 400 error |
| DB Error | No MongoDB | 500 error |

---

## 🛠️ Integration Checklist

- [ ] Endpoint accessible on http://localhost:8080/api/meetings/process
- [ ] Accepts JSON with "transcript" field
- [ ] Returns structured response
- [ ] Error messages are clear
- [ ] Logs are visible in console
- [ ] MongoDB connection working
- [ ] Frontend can parse JSON response

---

## 🔍 Debugging

| Issue | Check | Fix |
|-------|-------|-----|
| 404 Not Found | Server running? | Restart Spring Boot |
| 400 Bad Request | Valid JSON? | Check JSON syntax |
| 500 Error | MongoDB? | Check connection string |
| No logs | Logger enabled? | Check logback config |

---

## 📊 Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `meeting_id` | String | Unique meeting identifier |
| `meeting_title` | String | Auto-generated title |
| `tasks_extracted` | Integer | Number of tasks found |
| `tasks[]` | Array | List of extracted tasks |
| `status` | String | SUCCESS or FAILED |
| `message` | String | Status message |

---

## 💻 Frontend Integration (React)

```javascript
async function processMeeting(transcript) {
  try {
    const res = await fetch('/api/meetings/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });
    
    const data = await res.json();
    
    if (data.status === 'SUCCESS') {
      console.log(`${data.tasks_extracted} tasks extracted`);
      return data.tasks;
    } else {
      throw new Error(data.message);
    }
  } catch (err) {
    console.error('Failed:', err.message);
  }
}
```

---

## 📝 File Locations

| File | Purpose |
|------|---------|
| `MeetingController.java` | Main API controller |
| `MeetingProcessResponse.java` | Response DTO |
| `MeetingService.java` | Business logic |
| `TranscriptRequest.java` | Request DTO |

---

## ✅ Status Indicators

| Log Message | Meaning |
|-------------|---------|
| 📩 Incoming request | Request received |
| 🔥 EXECUTING | Processing started |
| ✅ Processing completed | Success |
| ❌ Error | Something failed |
| ⚠️ Warning | Non-critical issue |

---

## 🚨 Common Errors & Fixes

### Error: "Transcript cannot be empty"
**Fix:** Provide non-empty transcript string

### Error: "Connection refused"
**Fix:** Ensure MongoDB is running and accessible

### Error: "org.backend.taskpilot_ai class not found"
**Fix:** Recompile with `mvn clean compile`

### Error: "404 Not Found"
**Fix:** Check endpoint URL and Spring Boot port

---

## 🎯 Success Criteria

✅ Can POST to /api/meetings/process  
✅ Receives JSON response  
✅ Response contains meeting_id  
✅ Response contains tasks array  
✅ No exceptions in logs  
✅ Tasks are created in MongoDB  

---

## 📞 Quick Links

📄 Full API Docs: `MEETING_CONTROLLER_INTEGRATION_GUIDE.md`  
🧪 Test Guide: `TESTING_GUIDE.md`  
📊 Solution Summary: `SOLUTION_SUMMARY.md`  
🏗️ Architecture: Check controller code comments  

---

**Version:** 1.0  
**Status:** ✅ Production Ready  
**Last Updated:** 2026-03-28

