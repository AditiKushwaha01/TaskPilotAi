# 🚀 TaskPilot AI  
### Autonomous Meeting-to-Execution Intelligence Platform  

TaskPilot AI is a **multi-agent AI system** that transforms meeting discussions into structured tasks and autonomously manages their execution — ensuring accountability, transparency, and completion without manual follow-ups.

> 🏆 Built for **ET Avataar AI Hackathon 2026**  
> 🎯 Problem Statement #2: *Agentic AI for Autonomous Enterprise Workflows*

---

## 🌐 Live Demo  
🔗 [![Watch TaskPilot AI Demo](https://img.youtube.com/vi/SYe-8vEXQDI/0.jpg)](https://youtu.be/SYe-8vEXQDI)

---

## 🧠 Problem Statement  

In modern organizations:

- Meetings generate decisions, but not execution  
- Action items are unclear or forgotten  
- Follow-ups rely on manual effort  
- No centralized audit trail exists  

### ❌ Result:
- Missed deadlines  
- Reduced accountability  
- Operational inefficiency  

---

## 💡 Solution Overview  

TaskPilot AI introduces a **post-meeting execution layer powered by autonomous AI agents**.

### ✅ What it does:
- Converts unstructured meeting transcripts into structured tasks  
- Assigns ownership and deadlines  
- Continuously monitors task progress  
- Sends automated reminders  
- Escalates overdue tasks  
- Maintains a complete audit trail  

> ⚡ Once triggered, the system works **fully autonomously**

---

## 🤖 Multi-Agent Architecture  

| Agent | Responsibility |
|------|--------------|
| 🧠 Extraction Agent | Extracts tasks from meeting transcripts |
| 📋 Task Agent | Structures tasks, assigns owners & deadlines |
| ⏰ Reminder Agent | Tracks deadlines & sends notifications |
| 🚨 Escalation Agent | Escalates overdue tasks |
| 📊 Audit Agent | Maintains logs for transparency |

> 🔁 All agents are coordinated via a central orchestration layer

---

## 🏗️ System Architecture  

```
Frontend (React + Framer UI)
↓
Backend API Layer (Spring Boot)
↓
Orchestration Layer (Task Management Logic)
↓
AI Service (Python + FastAPI)
↓
Database (MongoDB)
```
![TaskPilot AI Architecture](./assets/architecture.png)
---

## ⚙️ Tech Stack

* **Frontend:** React.js, Framer (UI/UX)
* **Backend:** Java Spring Boot
* **AI Layer:** Python (FastAPI)
* **AI Model:** Gemini AI (task extraction)
* **Database:** MongoDB

---

## ✨ Features

### 📝 Meeting Input

* Paste meeting transcripts
* Upload `text` or .txt files
* Simulated live meeting input

### 🤖 AI Task Generation

* Extracts tasks, owners, deadlines
* Structured JSON output

### 📋 Task Dashboard

* View and manage all tasks
* Status updates (Pending, In Progress, Completed, Escalated)
* Filters and search

### ⏰ Autonomous Smart Reminder System

* Detects upcoming deadlines
* Sends notifications (simulated)

### 🚨 Auto Escalation Engine

* Flags overdue tasks
* Escalates to higher authority (simulated)

### 📊 Activity Logs

* Full audit trail of all system actions

---

## 🔁 End-to-End Workflow

1. User inputs meeting transcript
2. Extraction Agent processes content
3. Task Agent structures and assigns tasks
4. Tasks are stored and displayed in dashboard
5. Reminder Agent monitors deadlines
6. Escalation Agent handles delays
7. Audit Agent logs all actions
8. 
---

## 📦 Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/your-username/taskpilot-ai.git
cd taskpilot-ai
```

---

### 2. Backend (Spring Boot)

```bash
cd backend
mvn spring-boot:run
```

---

### 3. AI Service (Python)

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 4. Frontend (React)

```bash
cd frontend
npm install
npm start
```

---

## 🔑 Environment Variables

Create a `.env` file in the AI service:

```
GEMINI_API_KEY=your_api_key_here
```
---

## 📈 Impact

### Assumptions:

* Manager spends ~5 hours/week on follow-ups
* TaskPilot reduces effort by ~60%
  
### Outcome:

* ⏱️ ~3 hours saved per manager per week
* 👥 For 10 managers → 120+ hours saved/month
* 📈 Improved task completion rates
* 📊 Increased accountability via audit logs

---
## 🧪 Demo Flow

1. Paste meeting transcript
2. Click **Generate Tasks**
3. AI extracts and displays tasks
4. Tasks are assigned and tracked
5. System triggers reminders and escalations

---

## 🔮 Future Scope

* Integration with Zoom / Google Meet / Microsoft Teams
* Real-time speech-to-text using Whisper API
* Email / Slack notifications
* Role-based access control
* Advanced analytics dashboard

---

## 📜 Deployment Process
This repository reflects a structured development approach:

* Phase 1: task extraction MVP
* Phase 2: Multi-agent automation layer
* Phase 3: UI/UX enhancements
* Phase 4: Intelligent features
* 
## 🎥 Submission Deliveries

* ✅ Working prototype
* ✅ GitHub repository
* ✅ 3-minute demo video
* ✅ Architecture diagram
* ✅ Impact model

---

## 👨‍💻 Team

* Aditi Kushwaha

---

## 🏁 Conclusion

TaskPilot AI bridges the gap between **decision-making and execution** by introducing an **autonomous, agent-driven workflow system**.

It doesn’t just capture meetings —
it ensures execution happens.
---

⭐ If you found this project valuable, consider starring the repository.
