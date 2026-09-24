import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api/client';
import ResumeUpload from '../components/ResumeUpload';
import CandidateTable from '../components/CandidateTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import JobForm from '../components/JobForm';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score-desc');
  const [minScore, setMinScore] = useState(0);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [jobRes, candidatesRes] = await Promise.all([
        api.getJob(id),
        api.getJobCandidates(id)
      ]);
      setJob(jobRes.data);
      setCandidates(candidatesRes.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 404) {
        setError('Job not found');
      } else {
        setError('Failed to fetch job details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleUpdateJob = async (jobData) => {
    try {
      const res = await api.updateJob(id, jobData);
      setJob(res.data);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update job');
    }
  };

  const handleDeleteJob = async () => {
    if (window.confirm('Are you sure you want to delete this job and all its candidates?')) {
      try {
        await api.deleteJob(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete job');
      }
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      await api.deleteCandidate(candidateId);
      setCandidates(candidates.filter(c => c.id !== candidateId));
    } catch (err) {
      setError('Failed to delete candidate');
    }
  };

  if (loading) return <LoadingSpinner message="Loading job details..." />;
  if (!job && !loading) return <div className="card"><ErrorAlert message={error || 'Job not found'} /></div>;

  // Filter and sort candidates
  let filteredCandidates = candidates.filter(c => {
    const searchLower = searchTerm.toLowerCase();
    const nameMatch = c.name?.toLowerCase().includes(searchLower) || false;
    const emailMatch = c.email?.toLowerCase().includes(searchLower) || false;
    const scoreMatch = (Number(c.score) || 0) >= minScore;
    return (nameMatch || emailMatch) && scoreMatch;
  });

  filteredCandidates.sort((a, b) => {
    if (sortBy === 'score-desc') return (Number(b.score) || 0) - (Number(a.score) || 0);
    if (sortBy === 'score-asc') return (Number(a.score) || 0) - (Number(b.score) || 0);
    if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'date-desc') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  return (
    <div>
      <div className="mb-4">
        <button className="btn btn-secondary text-sm" onClick={() => navigate('/')}>
          &larr; Back to Jobs
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError('')} />

      {/* Job Details Section */}
      <div className="card mb-8">
        {isEditing ? (
          <div>
            <h2 className="mb-4">Edit Job</h2>
            <JobForm 
              job={job}
              onSubmit={handleUpdateJob}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="mb-2">{job.title}</h1>
                <div className="text-muted text-sm">
                  Created {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
                <button className="btn btn-danger" onClick={handleDeleteJob}>Delete</button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 grid-cols-md-2 mt-4">
              <div>
                <h3 className="text-sm text-muted uppercase mb-2">Description</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted uppercase mb-2">Requirements</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{job.requirements}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Section */}
      <div className="card mb-8">
        <h2 className="mb-4">Upload Resumes</h2>
        <ResumeUpload jobId={id} onUploadComplete={fetchData} />
      </div>

      {/* Candidates Section */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2>Candidates ({filteredCandidates.length})</h2>
        </div>

        <div className="alert alert-warning" style={{ backgroundColor: '#fef9c3', color: '#854d0e', border: '1px solid #fde047' }}>
          ⚠️ <strong>Disclaimer:</strong> Scores and analysis are provided as decision-support only. The AI may make mistakes and these scores do not represent objective hiring recommendations. Always review resumes manually.
        </div>

        <div className="filters-bar">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium whitespace-nowrap">Min Score: {minScore}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              style={{ width: '100px' }}
            />
          </div>

          <select 
            className="form-control" 
            style={{ width: 'auto' }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="score-desc">Score (High to Low)</option>
            <option value="score-asc">Score (Low to High)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="date-desc">Newest First</option>
          </select>
        </div>

        <CandidateTable 
          candidates={filteredCandidates} 
          onDelete={handleDeleteCandidate}
        />
      </div>
    </div>
  );
};

export default JobDetailPage;
