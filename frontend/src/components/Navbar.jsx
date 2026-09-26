import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (document.body.classList.contains('dark-mode')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-mode');
      setIsDarkMode(false);
    } else {
      document.body.classList.add('dark-mode');
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" className="navbar-brand">
          AI Resume Screener
        </Link>
        
        <div className="navbar-nav" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={toggleDarkMode} style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '20px' }}>
            {isDarkMode ? 'Light Mode \u2600\uFE0F' : 'Dark Mode \uD83C\uDF19'}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" style={{ marginRight: '1rem', color: 'var(--primary-color)', fontWeight: '500', textDecoration: 'none' }}>
                My Dashboard
              </Link>
              <span style={{ marginRight: '1rem', color: 'var(--text-light)' }}>
                {user.fullName || user.email}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Recruiter Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

