import React from 'react';
import { Link } from 'react-router-dom';

const JobList = ({ jobs, onEdit, onDelete }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="card text-center p-8">
        <p className="text-muted">No jobs created yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 grid-cols-md-2 grid-cols-lg-3">
      {jobs.map((job) => (
        <div key={job.id} className="card job-card" onClick={() => window.location.href = `/jobs/${job.id}`}>
          <div className="job-card-header">
            <h3 className="job-card-title">{job.title}</h3>
            <div className="job-card-date">
              Created: {new Date(job.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="job-card-body">
            {job.description}
          </div>
          <div className="job-card-footer">
            <div className="job-card-stats">
              {job.candidateCount || 0} Candidates
            </div>
            <div className="job-card-actions" onClick={(e) => e.stopPropagation()}>
              <button 
                className="btn btn-secondary text-sm" 
                onClick={() => onEdit(job)}
              >
                Edit
              </button>
              <button 
                className="btn btn-danger text-sm" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this job?')) {
                    onDelete(job.id);
                  }
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobList;
