"""
FastAPI application for the Resume Scoring Service.
"""
import os
import logging
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from models import ScoreRequest, ScoreResponse, HealthResponse
from scorer import TfidfScorer

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Resume Scoring Service",
    description="AI-powered service to score resumes against job descriptions.",
    version="1.0.0"
)

# Configure CORS
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "http://localhost:8080")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize scorer
scorer = TfidfScorer()

@app.post("/score", response_model=ScoreResponse)
def score_resume(request: ScoreRequest, req: Request):
    """
    Score a resume against a job description.
    """
    jd_length = len(request.job_description)
    resume_length = len(request.resume_text)
    
    logger.info(f"Received scoring request. JD length: {jd_length}, Resume length: {resume_length}")
    
    try:
        response = scorer.score(request.job_description, request.resume_text)
        logger.info(f"Scoring complete. Score: {response.score}")
        return response
    except Exception as e:
        logger.error(f"Error during scoring: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred while scoring the resume.")

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint.
    """
    return HealthResponse(
        status="ok",
        service="scoring-service",
        version="1.0.0"
    )
