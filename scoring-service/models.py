"""
Pydantic models for the scoring service.
"""
from typing import List
from pydantic import BaseModel, Field

class ScoreRequest(BaseModel):
    """Request model for scoring a resume against a job description."""
    job_description: str = Field(..., description="The job description text")
    resume_text: str = Field(..., description="The resume text")

class ScoreResponse(BaseModel):
    """Response model containing the score and explanation."""
    score: float = Field(..., description="Match score from 0 to 100")
    matched_terms: List[str] = Field(..., description="Key terms found in both job description and resume")
    missing_terms: List[str] = Field(..., description="Key terms found in job description but missing from resume")
    explanation: str = Field(..., description="Brief explanation of the score")

class HealthResponse(BaseModel):
    """Response model for health check endpoint."""
    status: str = Field(..., description="Service status (e.g., 'ok')")
    service: str = Field(..., description="Name of the service")
    version: str = Field(..., description="Version of the service")
