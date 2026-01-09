from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
import logging
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

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
from services.file_service import extract_text_from_file

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
        logger.info(f"[API] /analyze_gap - Mode: {request.interview_mode}, Days: {request.preparation_days}")
        logger.debug(f"[API] Request params - Interviewer: {request.interviewer_type}, Learning: {request.learning_style}")
        
        result = await analyze_gap_with_gemini(
            resume_text=request.resume_text,
            jd_text=request.jd_text,
            preparation_days=request.preparation_days,
            interview_mode=request.interview_mode,
            interviewer_type=request.interviewer_type,
            learning_style=request.learning_style or "theory_code"
        )
        
        logger.info(f"[API] ✅ Successfully generated roadmap with {len(result.daily_roadmap)} days")
        return result
        
    except ValueError as e:
        # Client errors (JSON parsing, validation)
        logger.error(f"[API] ❌ Validation error: {str(e)}")
        raise HTTPException(status_code=422, detail=f"Invalid response from AI: {str(e)}")
    except Exception as e:
        # Server errors (API failures, timeouts)
        logger.error(f"[API] ❌ Server error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing gap: {str(e)}")


@app.post("/parse_file", response_model=PDFUploadResponse)
async def parse_file(file: UploadFile = File(...)):
    """
    Parse PDF or TXT file and extract text content.
    """
    allowed_extensions = ('.pdf', '.txt')
    if not file.filename.lower().endswith(allowed_extensions):
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format. Please upload PDF or TXT files."
        )
    
    try:
        content = await file.read()
        text, page_count = extract_text_from_file(content, file.filename)
        return PDFUploadResponse(text=text, page_count=page_count)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing file: {str(e)}")


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
            interviewer_type=request.interviewer_type,
            learning_style="theory_code"  # Default for panic mode
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating panic mode: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
