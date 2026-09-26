import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicJobs = async () => {
      try {
        const res = await api.getPublicJobs();
        setJobs(res.data.data);
      } catch (err) {
        console.error('Failed to fetch public jobs', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicJobs();
  }, []);

  const handleJobClick = (jobId) => {
    // Navigate to job detail, if not logged in, PrivateRoute will catch it or the API will fail
    // We can explicitly navigate to the login with a returnUrl, or just let them click it
    navigate(/jobs/ + jobId);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to AI Resume Screener</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
          The smartest way to filter and rank candidates. Explore our public job board below, or log in as a recruiter to start screening resumes automatically using AI.
        </p>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Public Job Openings</h2>
      
      {loading ? (
        <LoadingSpinner message="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <div className="card text-center p-8 text-muted">
          No public jobs available right now. Log in to create some!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {jobs.map(job => (
            <div 
              key={job.id} 
              className="card" 
              style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column' }}
              onClick={() => handleJobClick(job.id)}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <h3 style={{ marginBottom: '10px' }}>{job.title}</h3>
              <p style={{ color: 'var(--text-light)', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {job.description}
              </p>
              <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee', fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                View Job & Apply &rarr;
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
