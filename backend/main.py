from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

from schemas import (
    AnalyzeGapRequest, 
    AnalyzeGapResponse, 
    PDFUploadResponse,
    UserCreate,
    User,
    GenerateTopicContentRequest,
    GenerateTopicContentResponse,
    PanicModeRequest,
    PanicModeResponse
)
from database import init_db, get_db, UserModel
from services.gemini_service import analyze_gap_with_gemini, generate_topic_content_with_gemini
from services.pdf_service import extract_text_from_pdf

load_dotenv()

app = FastAPI(title="JobPrep API", version="1.0.0")

# CORS Configuration
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    """Initialize database on startup"""
    init_db()
    print("✅ Database initialized")


@app.get("/")
def read_root():
    return {"message": "JobPrep API is running", "version": "1.0.0"}


@app.post("/analyze_gap", response_model=AnalyzeGapResponse)
async def analyze_gap(request: AnalyzeGapRequest):
    """
    Analyze the gap between resume and job description.
    Returns match percentage, critical gaps, and a daily roadmap.
    """
    try:
        result = await analyze_gap_with_gemini(
            resume_text=request.resume_text,
            jd_text=request.jd_text,
            preparation_days=request.preparation_days,
            interview_mode=request.interview_mode,
            interviewer_type=request.interviewer_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing gap: {str(e)}")


@app.post("/parse_pdf", response_model=PDFUploadResponse)
async def parse_pdf(file: UploadFile = File(...)):
    """
    Parse PDF file and extract text content.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    try:
        content = await file.read()
        text, page_count = extract_text_from_pdf(content)
        return PDFUploadResponse(text=text, page_count=page_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing PDF: {str(e)}")


@app.post("/users", response_model=User)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Create or update user from Google authentication.
    """
    # Check if user already exists
    db_user = db.query(UserModel).filter(UserModel.google_id == user.google_id).first()
    
    if db_user:
        # Update existing user
        db_user.email = user.email
        db_user.name = user.name
        db.commit()
        db.refresh(db_user)
        return db_user
    
    # Create new user
    db_user = UserModel(
        email=user.email,
        name=user.name,
        google_id=user.google_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.get("/users/{google_id}", response_model=User)
def get_user(google_id: str, db: Session = Depends(get_db)):
    """
    Get user by Google ID.
    """
    user = db.query(UserModel).filter(UserModel.google_id == google_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.post("/generate_topic_content", response_model=GenerateTopicContentResponse)
async def generate_topic_content(request: GenerateTopicContentRequest):
    """
    Generate AI-powered learning content for a specific topic based on user's learning style.
    """
    try:
        content = await generate_topic_content_with_gemini(
            resume_text=request.resume_text,
            jd_text=request.jd_text,
            topic=request.topic,
            task_type=request.task_type,
            learning_style=request.learning_style,
            gap_analysis=request.gap_analysis
        )
        return GenerateTopicContentResponse(content=content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating content: {str(e)}")


@app.post("/panic_mode", response_model=PanicModeResponse)
async def panic_mode(request: PanicModeRequest):
    """
    Generate a last-minute interview cheat sheet with critical information.
    Focus on must-know topics, quick wins, and survival tips.
    """
    try:
        from services.gemini_service import generate_panic_mode_with_gemini
        result = await generate_panic_mode_with_gemini(
            resume_text=request.resume_text,
            jd_text=request.jd_text,
            interview_mode=request.interview_mode,
            interviewer_type=request.interviewer_type
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating panic mode: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
