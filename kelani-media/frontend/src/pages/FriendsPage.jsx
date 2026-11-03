import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar';
import SearchBar from '../components/friends/SearchBar';
import FriendRequestCard from '../components/friends/FriendRequestCard';
import FindFriendCard from '../components/friends/FindFriendCard';
import ProfileStatsCard from '../components/friends/ProfileStatsCard';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);

  const currentUserId = "650000000000000000000001";

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/requests/pending/${currentUserId}`);
      if (res.ok) {
        const data = await res.json();
        setPendingRequests(data);
      }
    } catch (err) {
      console.error("Failed to fetch pending requests", err);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/request/accept/${requestId}`, { method: 'PUT' });
      if (res.ok) fetchPendingRequests();
    } catch (err) {
      console.error("Error accepting request", err);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await fetch(`http://localhost:8080/api/friends/request/reject/${requestId}`, { method: 'DELETE' });
      if (res.ok) fetchPendingRequests();
    } catch (err) {
      console.error("Error rejecting request", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar />
      <div className="flex-1 flex p-8 gap-8">
        <div className="flex-1 space-y-6">
          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          
          <div className="flex justify-center border-b border-gray-200">
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 px-8 font-semibold text-sm transition-all ${
                activeTab === 'requests'
                  ? 'border-b-2 border-[#800000] text-[#800000]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Request
            </button>
            <button
              onClick={() => setActiveTab('find')}
              className={`pb-3 px-8 font-semibold text-sm transition-all ${
                activeTab === 'find'
                  ? 'border-b-2 border-[#800000] text-[#800000]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Find Friends
            </button>
          </div>

          <div className="space-y-4 max-w-xl mx-auto">
            {activeTab === 'requests' ? (
              pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <FriendRequestCard key={req.id} req={req} onAccept={handleAccept} onReject={handleReject} />
                ))
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm bg-white rounded-xl border border-gray-100">
                  No pending friend requests.
                </div>
              )
            ) : (
              <FindFriendCard user={{ id: 'sample1', name: 'Sample Student' }} onAdd={() => {}} />
            )}
          </div>
        </div>

        <ProfileStatsCard friendsCount={106} orgsCount={8} />
      </div>
    </div>
  );
};

export default FriendsPage;