import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import JobDetailPage from './pages/JobDetailPage';
import CandidateDetailPage from './pages/CandidateDetailPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const LayoutWrapper = ({ children }) => {
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LayoutWrapper><HomePage /></LayoutWrapper>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <DashboardPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/jobs/:id" 
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <JobDetailPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/candidates/:id" 
        element={
          <ProtectedRoute>
            <LayoutWrapper>
              <CandidateDetailPage />
            </LayoutWrapper>
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
