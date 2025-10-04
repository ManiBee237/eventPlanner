from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten if needed
    allow_methods=["*"],
    allow_headers=["*"],
)

class Event(BaseModel):
    id: str
    title: str
    description: Optional[str] = ""
    venue: Optional[str] = ""
    tags: Optional[List[str]] = []
    date: str
    category: Optional[str] = ""

class Payload(BaseModel):
    interests: List[str] = []
    query: str = ""
    limit: int = 9
    events: List[Event]

def days_from_now(dt_str: str) -> int:
    try:
        dt = datetime.fromisoformat(dt_str.replace("Z",""))
        return int((dt - datetime.now()).total_seconds() // 86400 + 0.999)
    except Exception:
        return 9999

@app.post("/recommend")
def recommend(p: Payload):
    ql = (p.query or "").lower()
    user_tags = [t.lower() for t in p.interests]

    scored = []
    for e in p.events:
        title = (e.title or "").lower()
        desc  = (e.description or "").lower()
        venue = (e.venue or "").lower()
        tags  = [t.lower() for t in (e.tags or [])]

        tag_score = sum(3 for t in user_tags if t in tags)

        text_score = 0
        if ql:
            if ql in title: text_score += 3
            if ql in desc:  text_score += 2
            if ql in venue: text_score += 1

        days = days_from_now(e.date)
        recency = max(0.0, 5 - min(days, 10)) * 0.6

        scored.append((e, tag_score + text_score + recency))

    scored.sort(key=lambda x: x[1], reverse=True)
    return [s[0].model_dump() for s in scored[:p.limit]]
