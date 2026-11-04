import React from 'react';
import { Routes, Route } from 'react-router-dom';
import FriendsPage from './pages/FriendsPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="*" element={<FriendsPage />} /> {/* Fallback route so any path shows your page */}
    </Routes>
  );
}

export default App;