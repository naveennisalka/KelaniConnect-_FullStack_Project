import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar/Sidebar.jsx';
import SearchBar from '../components/friends/SearchBar.jsx';
import FriendRequestCard from '../components/friends/FriendRequestCard.jsx';
import FindFriendCard from '../components/friends/FindFriendCard.jsx';
import ProfileStatsCard from '../components/friends/ProfileStatsCard.jsx';
import { friendService } from '../services/friendService.js';
import { userService } from '../services/userService.js';
import toast from 'react-hot-toast';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingRequests, setPendingRequests] = useState([]);
  const [discoveryStudents, setDiscoveryStudents] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadFriends = async () => {
      try {
        const [requests, students, stats] = await Promise.all([
          friendService.getPendingRequests(),
          userService.discover(),
          friendService.getStats()
        ]);
        if (!cancelled) {
          setPendingRequests(requests);
          setDiscoveryStudents(students);
          setFriendsCount(stats.friendsCount);
        }
      } catch {
        if (!cancelled) {
          toast.error('Could not load friends. Please check your connection and try again.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFriends();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await friendService.acceptRequest(requestId);
      const acceptedRequest = pendingRequests.find((request) => request.id === requestId);
      setPendingRequests((requests) => requests.filter((request) => request.id !== requestId));
      setFriendsCount((count) => count + 1);
      if (acceptedRequest) {
        setDiscoveryStudents((students) => students.filter((student) => student.id !== acceptedRequest.senderId));
      }
      toast.success('Friend request accepted!');
    } catch {
      toast.error('Could not accept the friend request. Please try again.');
    }
  };

  const handleReject = async (requestId) => {
    try {
      await friendService.rejectRequest(requestId);
      setPendingRequests((requests) => requests.filter((request) => request.id !== requestId));
      toast('Request declined');
    } catch {
      toast.error('Could not decline the friend request. Please try again.');
    }
  };

  const handleAddFriend = async (studentId) => {
    try {
      await friendService.sendRequest(studentId);
      setDiscoveryStudents((students) => students.filter((student) => student.id !== studentId));
      toast.success('Friend request sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send the friend request. Please try again.');
    }
  };

  const filteredDiscoveryStudents = discoveryStudents.filter(s => {
    const q = searchQuery.toLowerCase();
    return (s.name || '').toLowerCase().includes(q) ||
           (s.faculty || '').toLowerCase().includes(q) ||
           (s.degree || '').toLowerCase().includes(q);
  });

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col lg:flex-row p-8 gap-8 max-w-7xl mx-auto min-w-0">
        <div className="flex-1 space-y-6 min-w-0">
          {/* Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Friends & Connections
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Connect with university batchmates, accept requests, and discover peers across faculties.
            </p>
          </div>

          <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />

          {/* Navigation Tabs */}
          <div className="flex justify-center border-b border-gray-200">
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-3 px-8 font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'requests'
                  ? 'border-b-2 border-[#800000] text-[#800000]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>Requests</span>
              {pendingRequests.length > 0 && (
                <span className="px-2 py-0.5 text-xs bg-[#800000] text-white rounded-full">
                  {pendingRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('find')}
              className={`pb-3 px-8 font-semibold text-sm transition-all flex items-center gap-2 ${
                activeTab === 'find'
                  ? 'border-b-2 border-[#800000] text-[#800000]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span>Find Friends</span>
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                {discoveryStudents.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-4 max-w-xl mx-auto">
            {loading ? (
              <p className="text-center py-12 text-gray-400 text-sm">Loading connections...</p>
            ) : activeTab === 'requests' ? (
              pendingRequests.length > 0 ? (
                pendingRequests.map((req) => (
                  <FriendRequestCard
                    key={req.id}
                    req={req}
                    onAccept={handleAccept}
                    onReject={handleReject}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
                  <p className="font-semibold text-gray-600">No pending friend requests</p>
                  <p className="text-xs">Switch to "Find Friends" to discover batchmates and connect!</p>
                </div>
              )
            ) : (
              filteredDiscoveryStudents.length > 0 ? (
                filteredDiscoveryStudents.map((student) => (
                  <FindFriendCard
                    key={student.id}
                    user={student}
                    onAdd={handleAddFriend}
                  />
                ))
              ) : (
                <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100 p-6 space-y-2">
                  <p className="font-semibold text-gray-600">No students matched "{searchQuery}"</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-[#800000] font-semibold hover:underline"
                  >
                    Clear search filter
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Profile Sidebar */}
        <ProfileStatsCard friendsCount={friendsCount} />
      </main>
    </div>
  );
};

export default FriendsPage;
