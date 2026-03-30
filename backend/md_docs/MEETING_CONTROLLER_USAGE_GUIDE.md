# 🎯 MeetingController Usage Guide - Complete Integration

## 📋 Overview

Your `MeetingController` is now fully enhanced with comprehensive exception handling and provides a complete API for meeting management. Here's how to use all its methods in your project.

---

## 🚀 API Endpoints Summary

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| `POST` | `/api/meetings/process` | Process meeting transcript | `MeetingProcessResponse` |
| `GET` | `/api/meetings/{id}` | Get meeting details | `MeetingProcessResponse` |
| `GET` | `/api/meetings/{id}/notifications` | Get meeting notifications | `List<Notification>` |
| `GET` | `/api/meetings/{id}/activity` | Get meeting activity logs | `List<ActivityLog>` |
| `GET` | `/api/meetings/activity/step/{step}` | Get activity by step type | `List<ActivityLog>` |
| `POST` | `/api/meetings/reminders/trigger` | Trigger reminder agent | `String` |
| `GET` | `/api/meetings/notifications/all` | Get all notifications | `List<Notification>` |
| `PUT` | `/api/meetings/notifications/{id}/read` | Mark notification as read | `String` |
| `GET` | `/api/meetings/health` | Health check | `String` |
| `GET` | `/api/meetings/test-exception/{type}` | Test exception handling | `String` |

---

## 💻 Frontend Integration Examples

### **1. Process Meeting Transcript (Main Feature)**

#### JavaScript/React
```javascript
async function processMeeting(transcript) {
  try {
    const response = await fetch('http://localhost:8080/api/meetings/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript: transcript
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Meeting processed:', data);
      console.log('📝 Tasks extracted:', data.tasks_extracted);
      console.log('🔔 Meeting ID:', data.meeting_id);

      // Handle success
      displayMeetingResults(data);
      return data;
    } else {
      console.error('❌ Error:', data.message);
      showError(data.message);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    showError('Network error occurred');
  }
}

// Usage
const transcript = "In today's meeting, John will prepare the report by Friday.";
processMeeting(transcript);
```

#### Angular/TypeScript
```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:8080/api/meetings';

  constructor(private http: HttpClient) {}

  processMeeting(transcript: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/process`, { transcript });
  }

  getMeeting(meetingId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${meetingId}`);
  }

  getMeetingNotifications(meetingId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${meetingId}/notifications`);
  }
}

// Component usage
export class MeetingComponent {
  constructor(private meetingService: MeetingService) {}

  processTranscript() {
    const transcript = "Meeting content here...";

    this.meetingService.processMeeting(transcript).subscribe({
      next: (response) => {
        console.log('✅ Success:', response);
        this.displayResults(response);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.showError(error.message);
      }
    });
  }
}
```

#### Vue.js
```javascript
// Composition API
import { ref } from 'vue'

export default {
  setup() {
    const meetingData = ref(null)
    const error = ref(null)
    const loading = ref(false)

    const processMeeting = async (transcript) => {
      loading.value = true
      error.value = null

      try {
        const response = await fetch('http://localhost:8080/api/meetings/process', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transcript })
        })

        const data = await response.json()

        if (response.ok) {
          meetingData.value = data
          console.log('✅ Meeting processed:', data.meeting_id)
        } else {
          error.value = data.message
        }
      } catch (err) {
        error.value = 'Network error occurred'
        console.error('❌ Error:', err)
      } finally {
        loading.value = false
      }
    }

    return {
      meetingData,
      error,
      loading,
      processMeeting
    }
  }
}
```

### **2. Get Meeting Details**

```javascript
async function getMeetingDetails(meetingId) {
  try {
    const response = await fetch(`http://localhost:8080/api/meetings/${meetingId}`);
    const data = await response.json();

    if (response.ok) {
      console.log('📖 Meeting details:', data);
      return data;
    } else {
      console.error('❌ Meeting not found');
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching meeting:', error);
  }
}

// Usage
const meeting = await getMeetingDetails('507f1f77bcf86cd799439011');
```

### **3. Get Meeting Notifications**

```javascript
async function getMeetingNotifications(meetingId) {
  try {
    const response = await fetch(`http://localhost:8080/api/meetings/${meetingId}/notifications`);
    const notifications = await response.json();

    if (response.ok) {
      console.log(`📢 Found ${notifications.length} notifications for meeting ${meetingId}`);
      return notifications;
    } else {
      console.error('❌ Error fetching notifications');
      return [];
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return [];
  }
}

// Usage
const notifications = await getMeetingNotifications('507f1f77bcf86cd799439011');
notifications.forEach(note => {
  console.log(`- ${note.type}: ${note.message}`);
});
```

### **4. Get Activity Logs**

```javascript
async function getMeetingActivity(meetingId) {
  try {
    const response = await fetch(`http://localhost:8080/api/meetings/${meetingId}/activity`);
    const activities = await response.json();

    if (response.ok) {
      console.log(`📊 Found ${activities.length} activity logs`);
      return activities;
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Get activity by step type
async function getActivityByStep(step) {
  const response = await fetch(`http://localhost:8080/api/meetings/activity/step/${step}`);
  return await response.json();
}

// Usage
const activities = await getMeetingActivity('507f1f77bcf86cd799439011');
const taskActivities = await getActivityByStep('TASK_EXTRACTION');
```

### **5. Notification Management**

```javascript
// Get all notifications
async function getAllNotifications() {
  const response = await fetch('http://localhost:8080/api/meetings/notifications/all');
  return await response.json();
}

// Mark notification as read
async function markNotificationAsRead(notificationId) {
  const response = await fetch(`http://localhost:8080/api/meetings/notifications/${notificationId}/read`, {
    method: 'PUT'
  });

  if (response.ok) {
    console.log('✅ Notification marked as read');
    return true;
  } else {
    console.error('❌ Failed to mark as read');
    return false;
  }
}

// Usage
const notifications = await getAllNotifications();
console.log(`📢 You have ${notifications.length} unread notifications`);

if (notifications.length > 0) {
  await markNotificationAsRead(notifications[0].id);
}
```

### **6. Manual Reminder Trigger**

```javascript
async function triggerReminders() {
  try {
    const response = await fetch('http://localhost:8080/api/meetings/reminders/trigger', {
      method: 'POST'
    });

    const result = await response.text();

    if (response.ok) {
      console.log('🔥 Reminder agent triggered:', result);
      return true;
    } else {
      console.error('❌ Failed to trigger reminders:', result);
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

// Usage (for testing purposes)
await triggerReminders();
```

---

## 🧪 Testing Examples

### **1. Test Normal Operation**

```bash
# Process a meeting
curl -X POST http://localhost:8080/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{"transcript":"In the meeting, John will prepare the report by Friday."}'

# Get meeting details
curl http://localhost:8080/api/meetings/YOUR_MEETING_ID

# Get notifications
curl http://localhost:8080/api/meetings/YOUR_MEETING_ID/notifications
```

### **2. Test Error Handling**

```bash
# Test empty transcript (should return 400)
curl -X POST http://localhost:8080/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{"transcript":""}'

# Test invalid meeting ID (should return 404)
curl http://localhost:8080/api/meetings/invalid-id

# Test exception handling
curl http://localhost:8080/api/meetings/test-exception/illegalargument
curl http://localhost:8080/api/meetings/test-exception/runtime
curl http://localhost:8080/api/meetings/test-exception/mongodb
```

### **3. Test Health Check**

```bash
curl http://localhost:8080/api/meetings/health
# Expected: "Meeting Controller is up and running ✅"
```

---

## 🔄 Complete Workflow Example

```javascript
// Complete meeting processing workflow
async function completeMeetingWorkflow(transcript) {
  try {
    // 1. Process the meeting
    console.log('🚀 Step 1: Processing meeting...');
    const processResponse = await fetch('http://localhost:8080/api/meetings/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript })
    });

    if (!processResponse.ok) {
      throw new Error('Failed to process meeting');
    }

    const meetingData = await processResponse.json();
    const meetingId = meetingData.meeting_id;

    console.log(`✅ Meeting processed: ${meetingId}`);
    console.log(`📝 Tasks extracted: ${meetingData.tasks_extracted}`);

    // 2. Get meeting details
    console.log('📖 Step 2: Fetching meeting details...');
    const meetingResponse = await fetch(`http://localhost:8080/api/meetings/${meetingId}`);
    const meetingDetails = await meetingResponse.json();

    console.log(`📋 Meeting title: ${meetingDetails.meeting_title}`);
    console.log(`📅 Created: ${meetingDetails.created_at}`);

    // 3. Check for notifications
    console.log('📢 Step 3: Checking notifications...');
    const notificationsResponse = await fetch(`http://localhost:8080/api/meetings/${meetingId}/notifications`);
    const notifications = await notificationsResponse.json();

    console.log(`🔔 Found ${notifications.length} notifications`);

    // 4. Check activity logs
    console.log('📊 Step 4: Checking activity logs...');
    const activityResponse = await fetch(`http://localhost:8080/api/meetings/${meetingId}/activity`);
    const activities = await activityResponse.json();

    console.log(`📈 Found ${activities.length} activity logs`);

    // 5. Mark notifications as read (if any)
    if (notifications.length > 0) {
      console.log('📖 Step 5: Marking notifications as read...');
      for (const notification of notifications) {
        await fetch(`http://localhost:8080/api/meetings/notifications/${notification.id}/read`, {
          method: 'PUT'
        });
      }
      console.log('✅ All notifications marked as read');
    }

    return {
      meeting: meetingData,
      details: meetingDetails,
      notifications: notifications,
      activities: activities
    };

  } catch (error) {
    console.error('❌ Workflow failed:', error);
    throw error;
  }
}

// Usage
const transcript = `
  In today's team meeting, we discussed the Q1 roadmap.
  John will prepare the budget report by Friday.
  Sarah needs to complete the design mockups by Wednesday.
  Mike should review the project timeline.
`;

completeMeetingWorkflow(transcript)
  .then(result => {
    console.log('🎉 Workflow completed successfully!');
    console.log('📊 Summary:', {
      meetingId: result.meeting.meeting_id,
      tasksExtracted: result.meeting.tasks_extracted,
      notifications: result.notifications.length,
      activities: result.activities.length
    });
  })
  .catch(error => {
    console.error('❌ Workflow failed:', error);
  });
```

---

## 📊 Response Format Examples

### **MeetingProcessResponse (Success)**
```json
{
  "meeting_id": "507f1f77bcf86cd799439011",
  "meeting_title": "Meeting 2026-03-28T...",
  "transcript": "In the meeting...",
  "created_at": "2026-03-28T18:23:36.345",
  "summary": "Meeting summary...",
  "tasks_extracted": 2,
  "tasks": [
    {
      "task_id": "507f1f77bcf86cd799439012",
      "title": "Prepare budget report",
      "owner": "John",
      "deadline": "2026-03-31T23:59:59",
      "status": "PENDING"
    }
  ],
  "status": "SUCCESS",
  "message": "Meeting processed successfully",
  "processed_at": "2026-03-28T18:23:45.135"
}
```

### **Notification Object**
```json
{
  "id": "507f1f77bcf86cd799439013",
  "meetingId": "507f1f77bcf86cd799439011",
  "taskId": "507f1f77bcf86cd799439012",
  "message": "Reminder: Task nearing deadline - Prepare budget report",
  "type": "REMINDER",
  "recipient": "John",
  "isRead": false,
  "createdAt": "2026-03-28T18:23:45.135"
}
```

### **ActivityLog Object**
```json
{
  "id": "507f1f77bcf86cd799439014",
  "meetingId": "507f1f77bcf86cd799439011",
  "step": "TASK_EXTRACTION",
  "action": "Extracted 2 tasks from transcript",
  "status": "SUCCESS",
  "timestamp": "2026-03-28T18:23:45.135"
}
```

---

## 🔧 Error Handling in Frontend

```javascript
// Centralized error handling
function handleApiError(error, context) {
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        console.warn(`⚠️ Validation error in ${context}:`, data.message);
        showUserMessage('Please check your input and try again.');
        break;

      case 404:
        console.warn(`⚠️ Not found in ${context}:`, data.message);
        showUserMessage('The requested item was not found.');
        break;

      case 500:
        console.error(`❌ Server error in ${context}:`, data.message);
        showUserMessage('A server error occurred. Please try again later.');
        break;

      default:
        console.error(`❌ Unexpected error in ${context}:`, data);
        showUserMessage('An unexpected error occurred.');
    }
  } else if (error.request) {
    // Network error
    console.error(`❌ Network error in ${context}:`, error.message);
    showUserMessage('Network error. Please check your connection.');
  } else {
    // Other error
    console.error(`❌ Error in ${context}:`, error.message);
    showUserMessage('An error occurred. Please try again.');
  }
}

// Usage in components
try {
  const result = await processMeeting(transcript);
  // Handle success
} catch (error) {
  handleApiError(error, 'meeting processing');
}
```

---

## 🎯 Best Practices for Using MeetingController

### **1. Always Handle Errors**
```javascript
// ✅ Good: Handle all error cases
try {
  const response = await fetch('/api/meetings/process', {/*...*/});
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  const data = await response.json();
  // Handle success
} catch (error) {
  // Handle error
}

// ❌ Bad: Ignoring potential errors
const data = await (await fetch('/api/meetings/process', {/*...*/})).json();
```

### **2. Validate Input Before Sending**
```javascript
function validateTranscript(transcript) {
  if (!transcript || transcript.trim().length === 0) {
    throw new Error('Transcript cannot be empty');
  }
  if (transcript.length > 10000) {
    throw new Error('Transcript is too long (max 10,000 characters)');
  }
  return transcript.trim();
}

// Usage
const transcript = validateTranscript(userInput);
await processMeeting(transcript);
```

### **3. Use Loading States**
```javascript
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const processMeeting = async (transcript) => {
  setLoading(true);
  setError(null);

  try {
    const result = await callApi(transcript);
    // Handle success
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

### **4. Implement Retry Logic for Network Issues**
```javascript
async function apiCallWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status !== 500) {
        return response;
      }
    } catch (error) {
      if (i === maxRetries - 1) throw error;
    }
    // Wait before retry
    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
  }
}
```

### **5. Cache Meeting Data**
```javascript
const meetingCache = new Map();

async function getMeetingCached(meetingId) {
  if (meetingCache.has(meetingId)) {
    return meetingCache.get(meetingId);
  }

  const meeting = await getMeeting(meetingId);
  meetingCache.set(meetingId, meeting);
  return meeting;
}
```

---

## 🚀 Advanced Usage Patterns

### **1. Real-time Meeting Processing**
```javascript
class MeetingProcessor {
  constructor() {
    this.processingQueue = [];
    this.isProcessing = false;
  }

  async addToQueue(transcript) {
    this.processingQueue.push(transcript);
    await this.processQueue();
  }

  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.processingQueue.length > 0) {
      const transcript = this.processingQueue.shift();
      try {
        await this.processSingleMeeting(transcript);
      } catch (error) {
        console.error('Failed to process meeting:', error);
      }
    }

    this.isProcessing = false;
  }

  async processSingleMeeting(transcript) {
    const result = await processMeeting(transcript);
    // Handle result (update UI, send notifications, etc.)
    return result;
  }
}

// Usage
const processor = new MeetingProcessor();
await processor.addToQueue("Meeting transcript 1");
await processor.addToQueue("Meeting transcript 2");
```

### **2. Batch Notification Management**
```javascript
async function markAllNotificationsAsRead() {
  const notifications = await getAllNotifications();

  const promises = notifications.map(notification =>
    markNotificationAsRead(notification.id)
  );

  await Promise.allSettled(promises);

  const successful = promises.filter(p => p.status === 'fulfilled').length;
  console.log(`✅ Marked ${successful}/${notifications.length} notifications as read`);
}
```

### **3. Meeting Analytics Dashboard**
```javascript
async function loadMeetingAnalytics(meetingId) {
  const [meeting, notifications, activities] = await Promise.all([
    getMeeting(meetingId),
    getMeetingNotifications(meetingId),
    getMeetingActivity(meetingId)
  ]);

  return {
    meeting,
    notificationCount: notifications.length,
    activityCount: activities.length,
    unreadNotifications: notifications.filter(n => !n.isRead).length,
    lastActivity: activities.sort((a, b) =>
      new Date(b.timestamp) - new Date(a.timestamp)
    )[0]
  };
}
```

---

## 📋 Summary

Your `MeetingController` is now a comprehensive, production-ready API with:

✅ **Complete Exception Handling** - All database and runtime exceptions caught  
✅ **Structured Responses** - Consistent `MeetingProcessResponse` format  
✅ **Full CRUD Operations** - Create, read, update for meetings and notifications  
✅ **Activity Tracking** - Complete audit trail of all operations  
✅ **Notification Management** - Full notification lifecycle  
✅ **Reminder Integration** - Automated reminder triggering  
✅ **Health Monitoring** - Built-in health checks  
✅ **Test Endpoints** - Exception testing capabilities  

**Use the provided examples to integrate with your frontend and start building amazing meeting management features!** 🎉
