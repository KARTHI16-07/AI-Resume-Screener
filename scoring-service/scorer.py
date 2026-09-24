"""
Scoring logic for comparing resumes to job descriptions.
"""
import abc
import re
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from models import ScoreResponse

class BaseScorer(abc.ABC):
    """Abstract base class for scorers."""
    
    @abc.abstractmethod
    def score(self, job_description: str, resume_text: str) -> ScoreResponse:
        """
        Score a resume against a job description.
        
        Args:
            job_description: The text of the job description.
            resume_text: The text of the resume.
            
        Returns:
            A ScoreResponse object containing the score and details.
        """
        pass

class TfidfScorer(BaseScorer):
    """
    Scorer implementation using TF-IDF and cosine similarity.
    Extracts key terms from the job description to identify matched/missing terms.
    """
    
    def __init__(self):
        """Initialize the scorer with stop words and basic configuration."""
        self.vectorizer = TfidfVectorizer(stop_words='english')

    def _extract_terms(self, text: str) -> List[str]:
        """
        Extract basic terms from text (simplified key term extraction).
        
        Args:
            text: Input text string.
            
        Returns:
            List of normalized words longer than 2 characters.
        """
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        return list(set(words))

    def score(self, job_description: str, resume_text: str) -> ScoreResponse:
        """
        Score the resume using TF-IDF cosine similarity.
        
        Args:
            job_description: The text of the job description.
            resume_text: The text of the resume.
            
        Returns:
            ScoreResponse containing the normalized score, terms, and explanation.
        """
        if not job_description.strip() or not resume_text.strip():
            return ScoreResponse(
                score=0.0,
                matched_terms=[],
                missing_terms=[],
                explanation="Both job description and resume must contain text."
            )

        if job_description.strip().lower() == resume_text.strip().lower():
            return ScoreResponse(
                score=100.0,
                matched_terms=[],
                missing_terms=[],
                explanation="Resume and job description are identical."
            )

        # Vectorize and compute similarity
        try:
            tfidf_matrix = self.vectorizer.fit_transform([job_description, resume_text])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        except ValueError:
            # Handle cases where vectorizer fails (e.g., only stop words)
            similarity = 0.0

        score_value = round(float(similarity) * 100, 2)
        
        # Extract terms
        jd_terms = self._extract_terms(job_description)
        resume_terms = self._extract_terms(resume_text)
        
        matched = [term for term in jd_terms if term in resume_terms]
        missing = [term for term in jd_terms if term not in resume_terms]
        
        # Keep top 10 for display
        matched_display = matched[:10]
        missing_display = missing[:10]
        
        # Construct explanation
        explanation = f"Resume matches {len(matched)} of {len(jd_terms)} key requirements extracted."
        if matched_display:
            explanation += f" Strong alignment in: {', '.join(matched_display).title()}."
        if missing_display:
            explanation += f" Missing: {', '.join(missing_display).title()}."
            
        return ScoreResponse(
            score=score_value,
            matched_terms=matched,
            missing_terms=missing,
            explanation=explanation
        )
