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
        setJobs(res.data.data || res.data);
        
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
    navigate(/jobs/\);
  };

  return (
    <div>
      <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--bg-card)', borderRadius: '8px', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to AI Resume Screener</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
          Explore our public job board below to apply as a Candidate, or log in as a Recruiter to start screening resumes automatically using AI.
        </p>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Public Job Openings</h2>
      
      {loading ? (
        <LoadingSpinner message="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <div className="card text-center p-8 text-muted">
          No public jobs available right now. Log in as a Recruiter to create some!
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {jobs.map(job => {
            const hasApplied = appliedJobIds.includes(job.id);
            return (
              <div 
                key={job.id} 
                className="card" 
                style={{ cursor: 'pointer', transition: 'transform 0.2s', display: 'flex', flexDirection: 'column', position: 'relative', border: hasApplied ? '2px solid #22c55e' : '' }}
                onClick={() => handleJobClick(job.id)}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {hasApplied && (
                  <div style={{ position: 'absolute', top: '-10px', right: '-10px', backgroundColor: '#22c55e', color: 'white', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    ?
                  </div>
                )}
                <h3 style={{ marginBottom: '10px', paddingRight: '20px' }}>{job.title}</h3>
                <p style={{ color: 'var(--text-light)', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {job.description}
                </p>
                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  {hasApplied ? 'View Job Details' : 'View Job & Apply \u2192'}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default HomePage;
