import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import ScoreBar from '../components/ScoreBar';
import SkillBadge from '../components/SkillBadge';

const CandidateDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        setLoading(true);
        const response = await api.getCandidate(id);
        setCandidate(response.data);
      } catch (err) {
        setError('Failed to load candidate details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCandidate();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      try {
        await api.deleteCandidate(id);
        navigate(`/jobs/${candidate.jobId}`);
      } catch (err) {
        setError('Failed to delete candidate');
      }
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await api.downloadResume(id);
      
      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Use original filename or generate one
      let filename = candidate.originalFilename || `resume_${candidate.name || 'candidate'}`;
      if (!filename.includes('.')) {
        // Guess extension from content type if possible, default to pdf
        const type = response.headers['content-type'];
        if (type?.includes('word')) filename += '.docx';
        else filename += '.pdf';
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError('Failed to download resume');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading candidate analysis..." />;
  if (!candidate && !loading) return <div className="card"><ErrorAlert message={error || 'Candidate not found'} /></div>;

  return (
    <div>
      <div className="mb-4">
        <button 
          className="btn btn-secondary text-sm" 
          onClick={() => navigate(`/jobs/${candidate.jobId}`)}
        >
          &larr; Back to Job
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError('')} />

      <div className="card mb-8">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
          <div>
            <h1 className="mb-1">{candidate.name || 'Unknown Candidate'}</h1>
            <p className="text-muted">{candidate.email || 'No email provided'}</p>
            <p className="text-sm text-muted mt-2">
              Uploaded on {new Date(candidate.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <button 
              className="btn btn-primary" 
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Downloading...' : 'Download Resume'}
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        <div className="mb-8" style={{ maxWidth: '400px' }}>
          <h3 className="mb-2">Overall Match Score</h3>
          <div style={{ transform: 'scale(1.2)', transformOrigin: 'left center' }}>
            <ScoreBar score={candidate.score} />
          </div>
        </div>

        <div className="grid grid-cols-1 grid-cols-md-2 gap-8 mb-8">
          <div>
            <h3 className="mb-4 text-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>✓</span> Matched Skills
            </h3>
            <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
              {candidate.matchedSkills && candidate.matchedSkills.length > 0 ? (
                candidate.matchedSkills.map((skill, i) => (
                  <SkillBadge key={i} label={skill} type="matched" />
                ))
              ) : (
                <p className="text-muted">No specific matched skills identified.</p>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>✗</span> Missing Skills
            </h3>
            <div className="flex flex-wrap" style={{ gap: '0.5rem' }}>
              {candidate.missingSkills && candidate.missingSkills.length > 0 ? (
                candidate.missingSkills.map((skill, i) => (
                  <SkillBadge key={i} label={skill} type="missing" />
                ))
              ) : (
                <p className="text-muted">No specific missing skills identified.</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-4">AI Analysis & Explanation</h3>
          <div 
            className="p-4" 
            style={{ 
              backgroundColor: '#f8fafc', 
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              lineHeight: '1.7'
            }}
          >
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {candidate.explanation || 'No detailed explanation available.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDetailPage;
