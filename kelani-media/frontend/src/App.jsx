import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FriendsPage from './pages/FriendsPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="*" element={<FriendsPage />} /> {/* Fallback route so any path shows your page */}
    </Routes>
  );
}

export default App;