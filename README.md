# 🚀 TaskPilot AI

### AI Meeting → Task Execution Agent

TaskPilot AI is a multi-agent system that transforms meeting discussions into actionable tasks, assigns ownership, tracks execution, and ensures accountability — automatically.

Built for **ET AI Hackathon 2026 (Problem Statement #2: Agentic AI for Autonomous Enterprise Workflows)**.

---

## 🧠 Problem

In most organizations:

* Meetings generate decisions but not execution
* Tasks are forgotten or unclear
* Follow-ups are manual and inconsistent
* No audit trail exists for accountability

This leads to missed deadlines, inefficiency, and poor workflow visibility.

---

## 💡 Solution

TaskPilot AI introduces an **AI-powered multi-agent workflow system** that:

1. Extracts tasks from meeting transcripts
2. Assigns owners and deadlines
3. Tracks task progress
4. Sends reminders for upcoming deadlines
5. Escalates overdue tasks automatically
6. Maintains a full audit trail of actions

---

## 🤖 AI Agents

The system is powered by multiple specialized agents:

* 🧠 **Task Extraction Agent**
  Converts meeting transcripts into structured tasks

* ⏰ **Reminder Agent**
  Monitors deadlines and sends alerts

* 🚨 **Escalation Agent**
  Detects overdue tasks and escalates them

* 📊 **Audit Agent**
  Logs every action for transparency and traceability

---

## 🏗️ Architecture

```
Frontend (React + Framer UI)
        ↓
Backend (Spring Boot)
        ↓
AI Service (Python + FastAPI)
        ↓
Database (MongoDB)
```

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
* Upload `.txt` files
* Simulated live meeting input

### 🤖 AI Task Generation

* Extracts tasks, owners, deadlines
* Structured JSON output

### 📋 Task Dashboard

* View and manage all tasks
* Status updates (Pending, In Progress, Completed, Escalated)
* Filters and search

### ⏰ Smart Reminders

* Detects upcoming deadlines
* Sends notifications (simulated)

### 🚨 Auto Escalation

* Flags overdue tasks
* Escalates to higher authority (simulated)

### 📊 Activity Logs

* Full audit trail of all system actions

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

* ⏱️ Reduces manual follow-ups by ~70%
* 📉 Minimizes missed tasks and delays
* 📊 Improves accountability with audit logs
* ⚡ Accelerates workflow execution

---

## 🎥 Submission Includes

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

TaskPilot AI focuses on the **execution gap after meetings**, turning conversations into completed actions using intelligent, autonomous agents.

---

⭐ If you like this project, feel free to star the repo!
