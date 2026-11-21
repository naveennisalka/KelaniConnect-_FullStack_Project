import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineTicket } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Sidebar from '../components/sidebar/Sidebar';
import EventAvatar from '../components/events/EventAvatar.jsx';
import EventFeedCard from '../components/events/EventFeedCard.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { eventService } from '../services/eventService.js';
import { formatEventDate, formatPrice, isEventOrganizer, isFollowingEvent } from '../utils/eventUtils.js';

// Events feed: shows all events and their posts.
// Right side tabs:
//   Watchlist -> events the user follows (+ invitations)
//   Passes    -> tickets the user bought
//   Events    -> events the user organizes (only shown if the user has any)
const EventsPage = () => {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('Watchlist');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventData, postData, passData] = await Promise.all([
          eventService.getEvents(),
          eventService.getAllPosts(),
          eventService.getMyPasses()
        ]);
        setEvents(eventData);
        setPosts(postData);
        setPasses(passData);
      } catch {
        toast.error('Could not load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ---------- Lists for the right side tabs ----------
  const myEvents = events.filter((event) => isEventOrganizer(event, user?.id));
  const watchlist = events.filter((event) => isFollowingEvent(event, user?.id) && !isEventOrganizer(event, user?.id));
  const invitations = events.filter((event) => (event.invitedIds || []).includes(user?.id));

  const tabs = myEvents.length > 0 ? ['Watchlist', 'Passes', 'Events'] : ['Watchlist', 'Passes'];

  // ---------- Feed ----------
  // Every event is one card and every event post is one card. Newest cards first.
  const findEvent = (eventId) => events.find((event) => event.id === eventId);

  const feedItems = [
    ...events.map((event) => ({ key: `event-${event.id}`, event, post: null, date: event.createdAt })),
    ...posts
      .filter((post) => findEvent(post.eventId)) // skip posts of deleted events
      .map((post) => ({ key: `post-${post.id}`, event: findEvent(post.eventId), post, date: post.createdAt }))
  ]
    .filter((item) => (item.event.title || '').toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Follow / unfollow from the bookmark button, then update that event in our list
  const handleToggleFollow = async (eventId) => {
    try {
      const updatedEvent = await eventService.toggleFollow(eventId);
      setEvents(events.map((event) => (event.id === eventId ? updatedEvent : event)));
    } catch {
      toast.error('Could not update your watchlist.');
    }
  };

  const studentName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Student';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* ==================== Center: search + feed ==================== */}
        <div className="flex-1 min-w-0 max-w-2xl space-y-6">
          <div className="relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Events"
              className="w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
            />
          </div>

          {loading && <p className="py-8 text-center text-sm text-gray-400">Loading events...</p>}

          {!loading && feedItems.length === 0 && (
            <p className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-400">
              {search ? 'No events match your search.' : 'No events yet. Create one from your profile page!'}
            </p>
          )}

          {feedItems.map((item) => (
            <EventFeedCard
              key={item.key}
              event={item.event}
              post={item.post}
              isFollowing={isFollowingEvent(item.event, user?.id)}
              onToggleFollow={() => handleToggleFollow(item.event.id)}
            />
          ))}
        </div>

        {/* ==================== Right side: user + tabs ==================== */}
        <aside className="w-full lg:w-96 flex-shrink-0">
          <div className="sticky top-6 space-y-6">
            {/* User */}
            <Link to="/profile" className="flex items-center gap-4 rounded-2xl p-2 hover:bg-white">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#800000]/10 text-xl font-bold text-[#800000]">
                  {studentName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900">{studentName}</p>
                <p className="text-xs text-gray-400">{user?.degreeProgram || user?.faculty || 'University of Kelaniya'}</p>
              </div>
            </Link>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`relative flex-1 py-3 text-sm font-semibold ${
                    activeTab === tab ? 'text-[#800000]' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-[#800000]" />}
                </button>
              ))}
            </div>

            {/* ----- Watchlist tab ----- */}
            {activeTab === 'Watchlist' && (
              <div className="space-y-6">
                {invitations.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="px-2 text-sm font-bold text-gray-800">Invitations</h3>
                    {invitations.map((event) => (
                      <div key={event.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white p-3 shadow-sm border border-gray-100">
                        <EventRow event={event} subtitle="You are invited" />
                        <button
                          type="button"
                          onClick={() => handleToggleFollow(event.id)}
                          className="flex-shrink-0 rounded-lg bg-[#800000] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#660000]"
                        >
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-3">
                  <h3 className="px-2 text-sm font-bold text-gray-800">Followed Events</h3>
                  {watchlist.length === 0 && (
                    <p className="px-2 text-sm text-gray-400">Follow events (or tap the bookmark) to see them here.</p>
                  )}
                  {watchlist.map((event) => (
                    <div key={event.id} className="rounded-2xl p-3 hover:bg-white">
                      <EventRow event={event} subtitle={formatEventDate(event.startsAt)} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----- Passes tab ----- */}
            {activeTab === 'Passes' && (
              <div className="space-y-3">
                <h3 className="px-2 text-sm font-bold text-gray-800">My Passes</h3>
                {passes.length === 0 && <p className="px-2 text-sm text-gray-400">Tickets you buy will show here.</p>}
                {passes.map((pass) => (
                  <Link
                    key={pass.id}
                    to={`/events/${pass.eventId}`}
                    className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:border-[#800000]/30"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#800000]/10">
                      <HiOutlineTicket className="h-6 w-6 text-[#800000]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-gray-900">{pass.itemName}</p>
                      <p className="truncate text-xs text-gray-500">{pass.eventTitle}</p>
                      <p className="text-xs text-gray-400">{formatEventDate(pass.eventStartsAt)}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#800000]">{formatPrice(pass.price)}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* ----- Events tab (only for organizers) ----- */}
            {activeTab === 'Events' && (
              <div className="space-y-3">
                <h3 className="px-2 text-sm font-bold text-gray-800">My Events</h3>
                {myEvents.map((event) => (
                  <div key={event.id} className="rounded-2xl p-3 hover:bg-white">
                    <EventRow event={event} subtitle={`${(event.followerIds || []).length} followers`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};

// Event photo + name + small text, links to the event page
const EventRow = ({ event, subtitle }) => (
  <Link to={`/events/${event.id}`} className="flex min-w-0 items-center gap-4">
    <EventAvatar event={event} size="w-14 h-14" textSize="text-lg" />
    <div className="min-w-0">
      <p className="truncate text-sm font-bold text-gray-900 hover:text-[#800000]">{event.title}</p>
      <p className="truncate text-xs text-gray-400">{subtitle}</p>
    </div>
  </Link>
);

export default EventsPage;
