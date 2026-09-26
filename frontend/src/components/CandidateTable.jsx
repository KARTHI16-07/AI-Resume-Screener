import React from 'react';
import { Link } from 'react-router-dom';
import * as api from '../api/client';

const CandidateTable = ({ candidates, onDelete }) => {
  const handleDownload = async (candidateId, fileName) => {
    try {
      const response = await api.downloadResume(candidateId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed', err);
      alert('Failed to download resume');
    }
  };

  const handleReply = async (email, name, candidateId) => {
    const subject = prompt(`Email Subject for ${name}:`, 'Update on your job application');
    if (!subject) return;
    const message = prompt(`Message to ${name}:`, `Hello ${name},\n\nWe would like to schedule an interview with you.`);
    if (!message) return;
    
    try {
      await api.replyToCandidate(candidateId, { subject, message });
      alert(`Email sent successfully to ${email}!`);
    } catch (err) {
      alert('Failed to send email');
    }
  };

  if (!candidates || candidates.length === 0) {
    return <div className="text-center p-8 text-muted">No candidates found matching the criteria.</div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th>Score</th>
            <th>Name</th>
            <th>Email</th>
            <th>Resume</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td>
                <span className={`badge ${candidate.score >= 80 ? 'badge-success' : candidate.score >= 50 ? 'badge-warning' : 'badge-danger'}`}>
                  {candidate.score ? Math.round(candidate.score) + '%' : 'N/A'}
                </span>
              </td>
              <td>{candidate.name || 'Unknown'}</td>
              <td>{candidate.email || 'Unknown'}</td>
              <td>
                <button 
                  className="btn btn-secondary text-sm"
                  onClick={() => handleDownload(candidate.id, candidate.resumeFileName)}
                  style={{ padding: '0.25rem 0.5rem' }}
                >
                  Download
                </button>
              </td>
              <td>{new Date(candidate.createdAt).toLocaleDateString()}</td>
              <td>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/candidates/${candidate.id}`} className="btn btn-primary text-sm" style={{ padding: '0.25rem 0.5rem' }}>
                    View Details
                  </Link>
                  <button 
                    className="btn btn-secondary text-sm" 
                    onClick={() => handleReply(candidate.email, candidate.name, candidate.id)}
                    style={{ padding: '0.25rem 0.5rem', backgroundColor: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd' }}
                  >
                    Reply
                  </button>
                  <button 
                    className="btn btn-secondary text-sm text-danger" 
                    onClick={() => onDelete(candidate.id)}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
