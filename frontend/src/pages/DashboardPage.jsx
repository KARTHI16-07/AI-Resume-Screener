import React, { useState, useEffect } from 'react';
import * as api from '../api/client';
import JobList from '../components/JobList';
import JobForm from '../components/JobForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

const DashboardPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.getJobs();
      setJobs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = async (jobData) => {
    await api.createJob(jobData);
    setShowModal(false);
    fetchJobs();
  };

  const handleUpdateJob = async (jobData) => {
    await api.updateJob(editingJob.id, jobData);
    setEditingJob(null);
    setShowModal(false);
    fetchJobs();
  };

  const handleDeleteJob = async (id) => {
    try {
      await api.deleteJob(id);
      fetchJobs();
    } catch (err) {
      setError('Failed to delete job');
    }
  };

  const openEditModal = (job) => {
    setEditingJob(job);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  if (loading) {
    return <LoadingSpinner message="Loading jobs..." />;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Your Jobs</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Create New Job
        </button>
      </div>

      <ErrorAlert message={error} onDismiss={() => setError('')} />

      <JobList 
        jobs={jobs} 
        onEdit={openEditModal} 
        onDelete={handleDeleteJob} 
      />

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingJob ? 'Edit Job' : 'Create New Job'}
              </h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <JobForm 
              job={editingJob} 
              onSubmit={editingJob ? handleUpdateJob : handleCreateJob}
              onCancel={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
