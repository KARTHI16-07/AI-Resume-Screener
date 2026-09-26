import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ErrorAlert from '../components/ErrorAlert';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', role: 'CANDIDATE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      const from = location.state?.from?.pathname || (formData.role === 'RECRUITER' ? '/dashboard' : '/');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
      <div className="card" style={{ width: '100%', maxWidth: '450px' }}>
        <h2 className="text-center mb-6">Create an Account</h2>
        
        <ErrorAlert message={error} onDismiss={() => setError('')} />

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">I am a...</label>
            <select 
              name="role" 
              className="form-control" 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="CANDIDATE">Job Seeker (Candidate)</option>
              <option value="RECRUITER">Employer (Recruiter)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-muted">
          Already have an account? <Link to="/login" className="text-primary">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

