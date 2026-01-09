from pydantic import BaseModel, Field
from typing import List, Optional


class AnalyzeGapRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    jd_text: str = Field(..., min_length=10, description="Job description text content")
    preparation_days: int = Field(..., ge=1, le=30, description="Number of days for preparation (1-30)")
    interview_mode: str = Field(default="interview", description="Mode: 'learn' or 'interview'")
    interviewer_type: Optional[str] = Field(default="technical", description="Type: 'hr', 'technical', 'lead', 'cto', 'ceo', 'mixed'")
    learning_style: Optional[str] = Field(default="theory_code", description="For 'learn' mode: 'project' or 'theory_code'")


class DailyTask(BaseModel):
    task: str
    type: str  # "Read", "Build", "Code", "Practice", "Project"
    duration: str
    completed: bool = False
    gap_type: Optional[str] = None  # "critical", "partial", or None
    gap_index: Optional[int] = None  # Position in critical_gaps or partial_skills list (0-indexed)


class DayRoadmap(BaseModel):
    day: int
    title: str
    focus: str
    tasks: List[DailyTask]


class GapAnalysis(BaseModel):
    critical_gaps: List[str]
    partial_skills: List[str]


class AnalyzeGapResponse(BaseModel):
    gap_analysis: GapAnalysis
    daily_roadmap: List[DayRoadmap]
    summary: str


class PDFUploadResponse(BaseModel):
    text: str
    page_count: int


class UserCreate(BaseModel):
    email: str
    name: Optional[str] = None
    google_id: str


class User(BaseModel):
    id: int
    email: str
    name: Optional[str] = None
    google_id: str

    class Config:
        from_attributes = True


class GenerateTopicContentRequest(BaseModel):
    resume_text: str
    jd_text: str
    topic: str
    task_type: str
    learning_style: str = Field(..., description="Learning style: visual, practical, theoretical, or balanced")
    gap_analysis: GapAnalysis


class GenerateTopicContentResponse(BaseModel):
    content: str


class PanicModeRequest(BaseModel):
    resume_text: str = Field(..., min_length=10, description="Resume text content")
    jd_text: str = Field(..., min_length=10, description="Job description text content")
    interview_mode: str = "interview"
    interviewer_type: Optional[str] = "technical"


class MustKnowTopic(BaseModel):
    topic: str
    why: str
    key_points: str


class PanicModeResponse(BaseModel):
    critical_gaps: List[str]
    quick_wins: List[str]
    must_know_topics: List[MustKnowTopic]
    survival_tips: List[str]
    talking_points: List[str]
