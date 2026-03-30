# 💼 Complete Working Examples

## Example 1: Basic Meeting Processing (cURL)

```bash
curl -X POST http://localhost:8080/api/meetings/process \
  -H "Content-Type: application/json" \
  -d '{
    "transcript": "In todays team meeting, we discussed the upcoming release. 
    John needs to complete the API endpoints by Friday. 
    Sarah will finalize the database schema. 
    Mike should prepare the deployment checklist by Wednesday."
  }'
```

**Response:**
```json
{
  "meeting_id": "65a8f2c9b3e4f5a6c7d8e9f0",
  "meeting_title": "Meeting 2026-03-28T18:23:36.345+05:30",
  "transcript": "In todays team meeting...",
  "created_at": "2026-03-28T18:23:36.345",
  "summary": "Team meeting about upcoming release with task assignments",
  "tasks_extracted": 3,
  "tasks": [
    {
      "task_id": "65a8f2c9b3e4f5a6c7d8e9f1",
      "title": "Complete API endpoints",
      "owner": "John",
      "deadline": "2026-03-31T23:59:59",
      "status": "PENDING",
      "meeting_id": "65a8f2c9b3e4f5a6c7d8e9f0",
      "reminder_sent": false,
      "escalated": false
    },
    {
      "task_id": "65a8f2c9b3e4f5a6c7d8e9f2",
      "title": "Finalize database schema",
      "owner": "Sarah",
      "deadline": null,
      "status": "PENDING",
      "meeting_id": "65a8f2c9b3e4f5a6c7d8e9f0",
      "reminder_sent": false,
      "escalated": false
    },
    {
      "task_id": "65a8f2c9b3e4f5a6c7d8e9f3",
      "title": "Prepare deployment checklist",
      "owner": "Mike",
      "deadline": "2026-03-26T23:59:59",
      "status": "PENDING",
      "meeting_id": "65a8f2c9b3e4f5a6c7d8e9f0",
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

## Example 2: React Frontend Integration

```jsx
import React, { useState } from 'react';

function MeetingProcessor() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const processMeeting = async () => {
    if (!transcript.trim()) {
      setError('Please enter a meeting transcript');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/meetings/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ transcript })
      });

      const data = await response.json();

      if (data.status === 'SUCCESS') {
        setResult(data);
        console.log(`✅ Processed meeting: ${data.meeting_id}`);
        console.log(`📝 Tasks extracted: ${data.tasks_extracted}`);
      } else {
        setError(data.message || 'Error processing meeting');
      }
    } catch (err) {
      setError(`Failed to connect: ${err.message}`);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1>🎯 Meeting Processor</h1>

      {/* Input Section */}
      <div>
        <label>Meeting Transcript:</label>
        <textarea
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Paste your meeting transcript here..."
          style={{
            width: '100%',
            minHeight: '150px',
            padding: '10px',
            fontSize: '14px'
          }}
        />
      </div>

      {/* Button */}
      <button
        onClick={processMeeting}
        disabled={loading}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? '⏳ Processing...' : '🚀 Process Meeting'}
      </button>

      {/* Error Display */}
      {error && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '5px',
          border: '1px solid #ef5350'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div style={{
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '5px',
          border: '1px solid #ddd'
        }}>
          <h2>✅ Meeting Processed Successfully</h2>

          {/* Meeting Info */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Meeting Details</h3>
            <p><strong>Meeting ID:</strong> {result.meeting_id}</p>
            <p><strong>Title:</strong> {result.meeting_title}</p>
            <p><strong>Created:</strong> {new Date(result.created_at).toLocaleString()}</p>
            <p><strong>Summary:</strong> {result.summary}</p>
          </div>

          {/* Tasks */}
          <div>
            <h3>📋 Extracted Tasks ({result.tasks_extracted})</h3>
            {result.tasks.length > 0 ? (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {result.tasks.map((task, index) => (
                  <li
                    key={task.task_id}
                    style={{
                      padding: '15px',
                      marginBottom: '10px',
                      backgroundColor: 'white',
                      borderLeft: '4px solid #007bff',
                      borderRadius: '3px'
                    }}
                  >
                    <div><strong>Task {index + 1}: {task.title}</strong></div>
                    <div>👤 <strong>Owner:</strong> {task.owner || 'Unassigned'}</div>
                    {task.deadline && (
                      <div>📅 <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}</div>
                    )}
                    <div>📌 <strong>Status:</strong> {task.status}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tasks extracted from this meeting</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MeetingProcessor;
```

---

## Example 3: Angular Integration

```typescript
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-meeting-processor',
  templateUrl: './meeting-processor.component.html',
  styleUrls: ['./meeting-processor.component.css']
})
export class MeetingProcessorComponent {
  transcript = '';
  loading = false;
  result: any = null;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  processMeeting() {
    if (!this.transcript.trim()) {
      this.error = 'Please enter a meeting transcript';
      return;
    }

    this.loading = true;
    this.error = null;

    this.http.post<any>(
      'http://localhost:8080/api/meetings/process',
      { transcript: this.transcript }
    ).subscribe(
      (response) => {
        if (response.status === 'SUCCESS') {
          this.result = response;
          console.log('✅ Meeting processed:', response.meeting_id);
        } else {
          this.error = response.message;
        }
        this.loading = false;
      },
      (error) => {
        this.error = `Error: ${error.message}`;
        this.loading = false;
      }
    );
  }

  getMeetingDetails(meetingId: string) {
    this.http.get<any>(
      `http://localhost:8080/api/meetings/${meetingId}`
    ).subscribe(
      (response) => {
        this.result = response;
      },
      (error) => {
        this.error = `Error fetching meeting: ${error.message}`;
      }
    );
  }
}
```

**Template (HTML):**
```html
<div class="container">
  <h1>🎯 Meeting Processor</h1>

  <div class="input-section">
    <label>Meeting Transcript:</label>
    <textarea
      [(ngModel)]="transcript"
      placeholder="Paste your meeting transcript here..."
    ></textarea>
  </div>

  <button
    (click)="processMeeting()"
    [disabled]="loading"
    class="btn"
  >
    {{ loading ? '⏳ Processing...' : '🚀 Process Meeting' }}
  </button>

  <div *ngIf="error" class="error">
    ❌ {{ error }}
  </div>

  <div *ngIf="result" class="success">
    <h2>✅ Results</h2>
    <h3>Meeting: {{ result.meeting_title }}</h3>
    <p>Tasks Extracted: {{ result.tasks_extracted }}</p>

    <div class="tasks">
      <h3>📋 Tasks</h3>
      <div *ngFor="let task of result.tasks" class="task-card">
        <strong>{{ task.title }}</strong>
        <p>Owner: {{ task.owner }}</p>
        <p *ngIf="task.deadline">Deadline: {{ task.deadline | date }}</p>
        <p>Status: {{ task.status }}</p>
      </div>
    </div>
  </div>
</div>
```

---

## Example 4: Python Integration

```python
import requests
import json

def process_meeting(transcript):
    """Process a meeting transcript using the API"""
    
    url = "http://localhost:8080/api/meetings/process"
    headers = {"Content-Type": "application/json"}
    data = {"transcript": transcript}
    
    try:
        response = requests.post(url, json=data, headers=headers)
        result = response.json()
        
        if result.get("status") == "SUCCESS":
            print(f"✅ Meeting processed: {result['meeting_id']}")
            print(f"📝 Tasks extracted: {result['tasks_extracted']}")
            
            for i, task in enumerate(result['tasks'], 1):
                print(f"\nTask {i}:")
                print(f"  Title: {task['title']}")
                print(f"  Owner: {task['owner']}")
                print(f"  Status: {task['status']}")
            
            return result
        else:
            print(f"❌ Error: {result['message']}")
            return None
            
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        return None

# Usage
transcript = """
In today's meeting, we discussed Q1 objectives.
Alice will prepare the budget proposal by March 31.
Bob needs to finalize the project timeline.
Carol should conduct the team training by March 25.
"""

result = process_meeting(transcript)

if result:
    print(f"\nMeeting Summary: {result['summary']}")
```

---

## Example 5: JavaScript (Vanilla)

```javascript
class MeetingAPI {
  constructor(baseUrl = 'http://localhost:8080/api') {
    this.baseUrl = baseUrl;
  }

  async processMeeting(transcript) {
    try {
      const response = await fetch(`${this.baseUrl}/meetings/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });

      const data = await response.json();
      return {
        success: response.ok && data.status === 'SUCCESS',
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getMeeting(meetingId) {
    try {
      const response = await fetch(`${this.baseUrl}/meetings/${meetingId}`);
      const data = await response.json();
      return {
        success: response.ok,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.baseUrl}/meetings/health`);
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Usage
const api = new MeetingAPI();

async function main() {
  // Check health
  const isHealthy = await api.healthCheck();
  console.log(isHealthy ? '✅ API is healthy' : '❌ API is down');

  // Process meeting
  const transcript = 'In this meeting, John will handle the report by Friday.';
  const result = await api.processMeeting(transcript);

  if (result.success) {
    console.log('✅ Meeting processed');
    console.log(`Tasks: ${result.data.tasks_extracted}`);
    result.data.tasks.forEach((task, i) => {
      console.log(`${i + 1}. ${task.title} (${task.owner})`);
    });
  } else {
    console.error('❌ Error:', result.error);
  }
}

main();
```

---

## Example 6: Postman Script

```javascript
// Pre-request Script
pm.environment.set("timestamp", new Date().toISOString());

// Test Script
pm.test("Response status is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has meeting_id", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.meeting_id).to.exist;
});

pm.test("Response status is SUCCESS", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.status).to.equal("SUCCESS");
});

pm.test("Tasks array exists and has items", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData.tasks).to.be.an('array');
    pm.expect(jsonData.tasks_extracted).to.be.greaterThan(0);
});

// Save meeting_id for later use
pm.environment.set("meeting_id", pm.response.json().meeting_id);
```

---

## Example 7: Java Integration

```java
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.RequestBody;
import okhttp3.MediaType;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class MeetingAPIClient {
    private static final String BASE_URL = "http://localhost:8080/api";
    private static final OkHttpClient client = new OkHttpClient();
    private static final Gson gson = new Gson();

    public static void processMeeting(String transcript) throws Exception {
        String url = BASE_URL + "/meetings/process";

        JsonObject json = new JsonObject();
        json.addProperty("transcript", transcript);

        RequestBody body = RequestBody.create(
            json.toString(),
            MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
            .url(url)
            .post(body)
            .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();
            JsonObject result = gson.fromJson(responseBody, JsonObject.class);

            if (result.get("status").getAsString().equals("SUCCESS")) {
                System.out.println("✅ Meeting processed: " + 
                    result.get("meeting_id").getAsString());
                System.out.println("📝 Tasks: " + 
                    result.get("tasks_extracted").getAsInt());
            } else {
                System.out.println("❌ Error: " + 
                    result.get("message").getAsString());
            }
        }
    }

    public static void main(String[] args) throws Exception {
        String transcript = "In this meeting, John will prepare the report by Friday.";
        processMeeting(transcript);
    }
}
```

---

All these examples are production-ready and can be used immediately! 🚀

