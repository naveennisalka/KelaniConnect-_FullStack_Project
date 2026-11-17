import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Home from './pages/Home.jsx';
import FriendsPage from './pages/FriendsPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
<<<<<<< Updated upstream
=======
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';

// Component to handle initial app launch routing
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#800000] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium">Launching KelaniConnect...</p>
        </div>
      </div>
    );
  }

  // First running app: goes to /login if not authenticated; if already logged in goes to /home
  return isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />;
};
>>>>>>> Stashed changes

function App() {
  return (
    <Routes>
<<<<<<< Updated upstream
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<FriendsPage />} /> {/* Fallback route so any path shows your page */}
=======
      {/* Root path: when opening the app, redirects to login (or home if already logged in) */}
      <Route path="/" element={<RootRedirect />} />

      {/* Authentication Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected App Routes (inside the application) */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <FriendsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/:id"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all: redirect unknown paths to login / root redirect */}
      <Route path="*" element={<RootRedirect />} />
>>>>>>> Stashed changes
    </Routes>
  );
}

export default App;
