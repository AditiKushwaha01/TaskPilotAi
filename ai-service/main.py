from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
import json
from dotenv import load_dotenv
from datetime import datetime
import google.generativeai as genai

load_dotenv()

app = FastAPI()

# ✅ Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# ✅ Use stable model
model = genai.GenerativeModel("gemini-1.5-flash-latest")

class TranscriptRequest(BaseModel):
    transcript: str


@app.post("/extract-tasks")
def extract_tasks(request: TranscriptRequest):

    if not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Transcript cannot be empty")

    prompt = f"""
Extract tasks from the meeting transcript.

STRICT RULES:
- Return ONLY valid JSON array
- No explanation, no markdown
- Each task MUST have: title, owner, deadline (YYYY-MM-DD)

Example:
[
  {{
    "title": "Design UI",
    "owner": "John",
    "deadline": "2026-03-25"
  }}
]

Transcript:
{request.transcript}
"""

    try:
        # 🔥 Gemini call
        response = model.generate_content(prompt)

        content = response.text.strip()

        # 🔥 DEBUG (VERY IMPORTANT)
        print("RAW GEMINI RESPONSE:", content)

        # 🔥 CLEAN RESPONSE (handles ```json or extra text)
        if "```" in content:
            content = content.replace("```json", "").replace("```", "").strip()

        # 🔥 Extract JSON safely
        start = content.find("[")
        end = content.rfind("]") + 1

        if start == -1 or end == -1:
            raise ValueError("No JSON array found in response")

        content = content[start:end]

        # 🔥 PARSE JSON
        tasks = json.loads(content)

        if not isinstance(tasks, list):
            raise ValueError("AI did not return a list")

        # 🔥 VALIDATE EACH TASK
        validated_tasks = []

        for t in tasks:
            if not all(k in t for k in ("title", "owner", "deadline")):
                raise ValueError(f"Missing fields in task: {t}")

            try:
                datetime.strptime(t["deadline"], "%Y-%m-%d")
            except:
                raise ValueError(f"Invalid date format in task: {t}")

            validated_tasks.append(t)

        return validated_tasks

    except Exception as e:
        print("❌ GEMINI ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"AI processing failed: {str(e)}"
        )