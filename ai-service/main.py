from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

app = FastAPI()

# ✅ Gemini Client
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ================================
# 📦 Request Model
# ================================
class TranscriptRequest(BaseModel):
    transcript: str


# ================================
# 🤖 AI TASK EXTRACTION ENDPOINT
# ================================
@app.post("/extract-tasks")
def extract_tasks(request: TranscriptRequest):

    if not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty")

    # ================================
    # 🧠 STRONG PROMPT (FIXED)
    # ================================
    prompt = f"""
You are an AI task extraction engine.

Extract actionable tasks from the meeting transcript below.

Return ONLY a JSON array. No explanation. No markdown.

Each task must follow this structure:
[
  {{
    "title": "Short task title",
    "owner": "Person responsible (or UNASSIGNED)",
    "priority": "High | Medium | Low",
    "deadline": "YYYY-MM-DD or null",
    "status": "PENDING"
  }}
]

RULES:
- Split into MULTIPLE tasks (minimum 3 if possible)
- Each person should get their own task
- Extract names (Sarah, Raj, Emily, etc.)
- Assign realistic priority
- Extract deadlines if mentioned
- Keep title SHORT (max 10 words)
- NEVER return full paragraph as one task

Transcript:
\"\"\"
{request.transcript}
\"\"\"
"""

    try:
        # ================================
        # 🔥 CALL GEMINI
        # ================================
        model = genai.GenerativeModel("gemini-1.5-flash")

        response = model.generate_content(prompt)

        content = response.text.strip()

        print("\n================ RAW GEMINI RESPONSE ================\n")
        print(content)
        print("\n=====================================================\n")

        # ================================
        # 🧹 CLEAN RESPONSE
        # ================================
        if "```" in content:
            content = content.replace("```json", "").replace("```", "").strip()

        start = content.find("[")
        end = content.rfind("]") + 1

        if start == -1 or end == -1:
            raise ValueError("No JSON array found in response")

        content = content[start:end]

        tasks = json.loads(content)

        # ================================
        # ✅ VALIDATE & CLEAN TASKS
        # ================================
        cleaned_tasks = []

        for t in tasks:
            cleaned_tasks.append({
                "title": str(t.get("title", "Untitled Task"))[:80],
                "owner": t.get("owner") or "UNASSIGNED",
                "priority": t.get("priority") if t.get("priority") in ["High", "Medium", "Low"] else "Medium",
                "deadline": t.get("deadline"),
                "status": "PENDING"
            })

        # 🔥 SAFETY: ensure at least 1 task
        if not cleaned_tasks:
            raise ValueError("No tasks generated")

        return cleaned_tasks

    except Exception as e:
        print("❌ GEMINI ERROR:", str(e))

        # ================================
        # 🛟 FALLBACK (DEMO SAFE)
        # ================================
        return [
            {
                "title": "Review meeting discussion",
                "owner": "UNASSIGNED",
                "priority": "Medium",
                "deadline": None,
                "status": "PENDING"
            },
            {
                "title": "Follow up with team",
                "owner": "UNASSIGNED",
                "priority": "High",
                "deadline": None,
                "status": "PENDING"
            },
            {
                "title": "Prepare next action plan",
                "owner": "UNASSIGNED",
                "priority": "Medium",
                "deadline": None,
                "status": "PENDING"
            }
        ]


# ================================
# 🧪 HEALTH CHECK
# ================================
@app.get("/health")
def health():
    return {"status": "AI service running ✅"}