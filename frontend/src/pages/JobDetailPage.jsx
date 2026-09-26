import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as api from '../api/client';
import ResumeUpload from '../components/ResumeUpload';
import CandidateTable from '../components/CandidateTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import JobForm from '../components/JobForm';
import { useAuth } from '../context/AuthContext';

const JobDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score-desc');
  const [minScore, setMinScore] = useState(0);

  // Candidate Apply states
  const [applyName, setApplyName] = useState(user?.fullName || '');
  const [applyEmail, setApplyEmail] = useState(user?.email || '');
  const [applyFile, setApplyFile] = useState(null);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);

  const isRecruiter = user?.role === 'RECRUITER';

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isRecruiter) {
        const [jobRes, candidatesRes] = await Promise.all([
          api.getJob(id),
          api.getJobCandidates(id)
        ]);
        setJob(jobRes.data);
        setCandidates(candidatesRes.data);
      } else {
        const res = await api.getJob(id); // candidates use public getJob or authenticated getJob?
        // Wait, getJob currently checks user ownership! We need to fetch it publicly.
        // I will use getPublicJobs and find it, or we already have the ID so just display the title.
        // Actually, candidates can see the job on the public page. Let's just fetch all public and find.
        const resAll = await api.getPublicJobs();
        const found = resAll.data.data.find(j => j.id === parseInt(id));
        if (found) setJob(found); else setError('Job not found');
      }
      setError('');
    } catch (err) {
      setError('Failed to fetch details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, isRecruiter]);

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
        navigate('/dashboard');
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

  const handleApply = async (e) => {
    e.preventDefault();
    if (!applyFile) { setError('Please select a resume'); return; }
    
    setApplyLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('name', applyName);
    formData.append('email', applyEmail);
    formData.append('file', applyFile);

    try {
      await api.applyForJob(id, formData, () => {});
      setApplySuccess(true);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Failed to apply: ' + (err.response?.data?.message || err.message));
    } finally {
      setApplyLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message="Loading job details..." />;
  if (!job && !loading) return <div className="card"><ErrorAlert message={error || 'Job not found'} /></div>;

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
        <button className="btn btn-secondary text-sm" onClick={() => navigate(isRecruiter ? '/dashboard' : '/')}>
          &larr; Back
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError('')} />

      <div className="card mb-8">
        {isEditing && isRecruiter ? (
          <div>
            <h2 className="mb-4">Edit Job</h2>
            <JobForm job={job} onSubmit={handleUpdateJob} onCancel={() => setIsEditing(false)} />
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="mb-2">{job.title}</h1>
                <div className="text-muted text-sm">Posted {new Date(job.createdAt).toLocaleDateString()}</div>
              </div>
              {isRecruiter && (
                <div className="flex gap-2">
                  <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit</button>
                  <button className="btn btn-danger" onClick={handleDeleteJob}>Delete</button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 grid-cols-md-2 mt-4">
              <div><h3 className="text-sm text-muted uppercase mb-2">Description</h3><p style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p></div>
              <div><h3 className="text-sm text-muted uppercase mb-2">Requirements</h3><p style={{ whiteSpace: 'pre-wrap' }}>{job.requirements}</p></div>
            </div>
          </div>
        )}
      </div>

      {isRecruiter ? (
        <>
          <div className="card mb-8">
            <h2 className="mb-4">Upload Resumes</h2>
            <ResumeUpload jobId={id} onUploadComplete={fetchData} />
          </div>
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2>Candidates ({filteredCandidates.length})</h2>
              <button className="btn btn-secondary" onClick={async () => {
                  const subject = prompt("Subject for all candidates:", "Update on your application");
                  if (!subject) return;
                  const message = prompt("Message to all candidates:", "Hello everyone,\n\n");
                  if (!message) return;
                  try { await api.replyToAll(id, { subject, message }); alert("Successfully emailed all candidates!"); } 
                  catch(err) { alert("Failed to send emails"); }
                }} style={{ backgroundColor: "#e0f2fe", color: "#0369a1", borderColor: "#bae6fd" }}>
                Reply All
              </button>
            </div>
            <div className="filters-bar">
              <input type="text" className="form-control search-input" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              <select className="form-control" style={{ width: 'auto' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="score-desc">Score (High to Low)</option>
                <option value="score-asc">Score (Low to High)</option>
              </select>
            </div>
            <CandidateTable candidates={filteredCandidates} onDelete={handleDeleteCandidate} />
          </div>
        </>
      ) : (
        <div className="card mb-8">
          {applySuccess ? (
            <div className="text-center p-8">
              <h2 style={{ color: 'var(--primary-color)', marginBottom: '10px' }}>Thank you for applying!</h2>
              <p className="text-muted">Your resume has been submitted to the recruiter. Redirecting you home...</p>
            </div>
          ) : (
            <>
              <h2 className="mb-4">Apply for this Job</h2>
              <form onSubmit={handleApply}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-control" value={applyName} onChange={e => setApplyName(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-control" value={applyEmail} onChange={e => setApplyEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Resume (PDF or DOCX)</label>
                  <input type="file" className="form-control" accept=".pdf,.docx" onChange={e => setApplyFile(e.target.files[0])} required />
                </div>
                <button type="submit" className="btn btn-primary mt-4" disabled={applyLoading}>
                  {applyLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default JobDetailPage;
