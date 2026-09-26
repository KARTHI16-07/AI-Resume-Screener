import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.getPublicJobs();
        setJobs(res.data.data || res.data || []);
        
        if (user && user.role === 'CANDIDATE') {
          const appliedRes = await api.getMyApplications();
          setAppliedJobIds(appliedRes.data.data || appliedRes.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleJobClick = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: '120px 20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', marginBottom: '40px', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', fontWeight: 'bold' }}>Find Your Dream Job with AI</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
          Welcome to the future of hiring. We use advanced artificial intelligence to instantly match your skills to the perfect job openings. Scroll down to explore our open roles and apply in seconds.
        </p>
        <button 
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="btn btn-primary"
          style={{ padding: '15px 30px', fontSize: '1.1rem', borderRadius: '30px' }}
        >
          View Open Jobs ↓
        </button>
      </div>

      {/* Features Section */}
      <div style={{ display: 'flex', gap: '30px', marginBottom: '80px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', padding: '30px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>Smart Matching</h3>
          <p className="text-muted">Our AI reads your resume and scores it directly against the job requirements, giving you the best chance to stand out.</p>
        </div>
        <div style={{ flex: '1 1 300px', padding: '30px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>1-Click Apply</h3>
          <p className="text-muted">No more filling out endless forms. Just upload your PDF or Word document resume and you're instantly in the system.</p>
        </div>
        <div style={{ flex: '1 1 300px', padding: '30px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ marginBottom: '15px', color: 'var(--primary-color)' }}>Fast Responses</h3>
          <p className="text-muted">Recruiters get immediate analysis, meaning you get heard back faster instead of waiting weeks for a human to review.</p>
        </div>
      </div>

      {/* Job Board Section */}
      <div id="job-board" style={{ minHeight: '100vh', paddingTop: '40px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', textAlign: 'center' }}>Open Positions</h2>
        <p style={{ textAlign: 'center', marginBottom: '40px', color: 'var(--text-light)' }}>Find a role that matches your expertise and apply today.</p>
        
        {loading ? (
          <LoadingSpinner message="Loading jobs..." />
        ) : jobs.length === 0 ? (
          <div className="card text-center p-8 text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
            No open jobs available right now. Please check back later!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' }}>
            {jobs.map(job => {
              const hasApplied = appliedJobIds.includes(job.id);
              return (
                <div 
                  key={job.id} 
                  className="card" 
                  style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', display: 'flex', flexDirection: 'column', position: 'relative', border: hasApplied ? '2px solid #22c55e' : '1px solid var(--border-color)', borderRadius: '12px', padding: '25px' }}
                  onClick={() => handleJobClick(job.id)}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {hasApplied && (
                    <div style={{ position: 'absolute', top: '-12px', right: '-12px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)', fontSize: '14px' }}>
                      ✓
                    </div>
                  )}
                  <h3 style={{ marginBottom: '15px', paddingRight: '20px', fontSize: '1.4rem' }}>{job.title}</h3>
                  <p style={{ color: 'var(--text-light)', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', lineHeight: '1.6' }}>
                    {job.description}
                  </p>
                  <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid var(--border-color)', fontSize: '1rem', color: 'var(--primary-color)', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {hasApplied ? <span>Applied Successfully</span> : <span>View Details</span>}
                    <span style={{ fontSize: '1.2rem' }}>&rarr;</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
