import React from 'react';
import DesignDetails from './pages/DesignDetails';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AuthModal from './components/AuthModal';
import ArchitectDashboard from './pages/ArchitectDashboard';
import UserDashboard from './pages/UserDashboard';
import HomeTrendsPage from './pages/HomeTrendsPage';
import ArchitectsPage from './pages/ArchitectsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/designs/:id" element={<DesignDetails />} />
          <Route path="/auth" element={<AuthModal />} />
          <Route path="/home-trends" element={<HomeTrendsPage />} />
          <Route path="/architects-info" element={<ArchitectsPage />} />

          <Route
            path="/architect-dashboard"
            element={
              <ProtectedRoute requiredRole="architect">
                <ArchitectDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;