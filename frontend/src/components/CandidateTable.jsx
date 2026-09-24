import React from 'react';
import { useNavigate } from 'react-router-dom';
import ScoreBar from './ScoreBar';
import SkillBadge from './SkillBadge';

const CandidateTable = ({ candidates, onDelete }) => {
  const navigate = useNavigate();

  if (!candidates || candidates.length === 0) {
    return (
      <div className="card text-center p-8">
        <p className="text-muted">No candidates found.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Candidate Name</th>
            <th>Email</th>
            <th>Match Score</th>
            <th>Top Matched Skills</th>
            <th>Upload Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id} onClick={() => navigate(`/candidates/${candidate.id}`)}>
              <td style={{ fontWeight: 500 }}>{candidate.name || 'Unknown'}</td>
              <td>{candidate.email || 'N/A'}</td>
              <td style={{ width: '200px' }}>
                <ScoreBar score={candidate.score} />
              </td>
              <td>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '300px' }}>
                  {candidate.matchedSkills && candidate.matchedSkills.length > 0 ? (
                    candidate.matchedSkills.slice(0, 3).map((skill, idx) => (
                      <SkillBadge key={idx} label={skill} type="matched" />
                    ))
                  ) : (
                    <span className="text-muted text-sm">None identified</span>
                  )}
                  {candidate.matchedSkills && candidate.matchedSkills.length > 3 && (
                    <span className="text-sm text-muted">+{candidate.matchedSkills.length - 3} more</span>
                  )}
                </div>
              </td>
              <td>{new Date(candidate.createdAt).toLocaleDateString()}</td>
              <td onClick={(e) => e.stopPropagation()}>
                <button 
                  className="btn btn-secondary text-sm mr-2"
                  onClick={() => navigate(`/candidates/${candidate.id}`)}
                  style={{ marginRight: '0.5rem' }}
                >
                  View
                </button>
                <button 
                  className="btn btn-danger text-sm"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this candidate?')) {
                      onDelete(candidate.id);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CandidateTable;
