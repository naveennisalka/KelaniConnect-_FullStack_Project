import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../components/sidebar/Sidebar';
import { useAuth } from '../context/AuthContext.jsx';
import { userService } from '../services/userService.js';
import { postService } from '../services/postService.js';
import { eventService } from '../services/eventService.js';
import { friendService } from '../services/friendService.js';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Posts');
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const { user, updateUser } = useAuth();
  const { id } = useParams();
  const profileId = id || user?.id;
  const isOwnProfile = !id || id === user?.id;

  useEffect(() => {
    let cancelled = false;
    if (!profileId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      userService.getProfile(profileId),
      postService.getFeed(),
      eventService.getEvents()
    ]).then(([data, allPosts, allEvents]) => {
      if (!cancelled) {
        setProfile(data);
        setProfileForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          bio: data.bio || '',
          profilePicture: data.profilePicture || '',
          faculty: data.faculty || '',
          degreeProgram: data.degreeProgram || ''
        });
        setPosts(allPosts.filter((post) => post.authorId === profileId));
        setEvents(allEvents.filter((event) => event.organizerId === profileId));
      }
    })
      .catch(() => {
        if (!cancelled) toast.error('Could not load this profile. Please try again.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [profileId]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updatedProfile = await userService.updateProfile(profileForm);
      setProfile(updatedProfile);
      updateUser(updatedProfile);
      setEditing(false);
      toast.success('Profile updated.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update your profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFriend = async () => {
    try {
      await friendService.sendRequest(profile.id);
      toast.success('Friend request sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not send the friend request.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Profile Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Photo */}
          <div className="w-full h-48 bg-gray-200"></div>

          {/* Profile Details Bar */}
          <div className="px-8 pb-6 flex justify-between items-end relative">
            <div className="flex items-end gap-4 -mt-12">
            {profile?.profilePicture ? (
              <img src={profile.profilePicture} alt="Profile" className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md flex items-center justify-center text-2xl font-bold text-gray-600">
                {(profile?.firstName || 'S').charAt(0)}
              </div>
            )}
              <div className="mb-1">
                <h2 className="text-lg font-bold text-gray-800">
                  {loading ? 'Loading profile...' : `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'Profile unavailable'}
                </h2>
                <p className="text-xs text-gray-400">
                  {[profile?.degreeProgram, profile?.faculty].filter(Boolean).join(' · ')}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              {isOwnProfile ? (
                <button onClick={() => setEditing((current) => !current)} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm">
                  {editing ? 'Cancel edit' : 'Edit profile'}
                </button>
              ) : (
                <button onClick={handleAddFriend} className="bg-[#800000] text-white hover:bg-[#600000] px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm">
                  Add Friend
                </button>
              )}
            </div>
          </div>

          {/* Tabs Navigation (Posts, Events, Info) */}
          <div className="flex gap-8 border-t border-gray-100 px-8">
            {['Posts', 'Events', 'Info'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-xs font-semibold transition-colors relative ${
                  activeTab === tab ? 'text-[#800000]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#800000] rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {editing && isOwnProfile && (
          <form onSubmit={handleProfileSave} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
            {[
              ['firstName', 'First name'],
              ['lastName', 'Last name'],
              ['faculty', 'Faculty'],
              ['degreeProgram', 'Degree program'],
              ['profilePicture', 'Profile photo URL'],
              ['bio', 'About']
            ].map(([field, label]) => (
              <label key={field} className="block text-xs font-semibold text-gray-600">
                {label}
                {field === 'bio' ? (
                  <textarea
                    value={profileForm[field]}
                    onChange={(e) => setProfileForm({ ...profileForm, [field]: e.target.value })}
                    maxLength={500}
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm font-normal"
                  />
                ) : (
                  <input
                    type={field === 'profilePicture' ? 'url' : 'text'}
                    value={profileForm[field]}
                    onChange={(e) => setProfileForm({ ...profileForm, [field]: e.target.value })}
                    maxLength={
                      field === 'profilePicture' ? 2048 :
                      field === 'firstName' || field === 'lastName' ? 80 :
                      field === 'faculty' ? 120 : 160
                    }
                    className="mt-1 w-full rounded-lg border border-gray-200 p-3 text-sm font-normal"
                  />
                )}
              </label>
            ))}
            <button type="submit" disabled={saving} className="rounded-lg bg-[#800000] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? 'Saving...' : 'Save profile'}
            </button>
          </form>
        )}

        {/* Dynamic Tab Content Area (Wireframe Clean View) */}
        {activeTab === 'Posts' && (
          <div className="space-y-4">
            {posts.length ? posts.map((post) => (
              <article key={post.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-3">
                <p className="text-sm text-gray-700 whitespace-pre-line">{post.content}</p>
                {post.mediaUrl && <img src={post.mediaUrl} alt="Post attachment" loading="lazy" className="max-h-96 w-full rounded-xl object-cover" />}
                <p className="text-xs text-gray-400">{post.likedBy.length} likes · {post.comments.length} comments</p>
              </article>
            )) : (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[200px] flex items-center justify-center">
                <p className="text-sm text-gray-400">No posts to show yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Events' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-800">Organized Events</h3>
              <Link to="/events" className="text-xs font-semibold text-[#800000]">All events</Link>
            </div>
            {events.length ? events.map((event) => (
              <div key={event.id} className="border-b border-gray-100 py-3 last:border-0">
                <p className="text-sm font-semibold text-gray-800">{event.title}</p>
                <p className="text-xs text-gray-500">{event.organizer} · {event.location} · {new Date(event.startsAt).toLocaleString()}</p>
              </div>
            )) : <p className="text-sm text-gray-400">No events to show yet.</p>}
          </div>
        )}

        {activeTab === 'Info' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
            <h3 className="text-sm font-bold text-gray-800 mb-4">User Information</h3>
            <div className="text-xs text-gray-500 space-y-2">
              <p><strong>Faculty:</strong> {profile?.faculty || 'Not provided'}</p>
              <p><strong>Degree:</strong> {profile?.degreeProgram || 'Not provided'}</p>
              {profile?.bio && <p><strong>About:</strong> {profile.bio}</p>}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;