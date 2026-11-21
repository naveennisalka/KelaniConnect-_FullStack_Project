import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  HiOutlineSpeakerphone,
  HiOutlinePlusCircle,
  HiCheckCircle,
  HiChevronDown,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiOutlineUserGroup
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import Sidebar from '../components/sidebar/Sidebar';
import EventAvatar from '../components/events/EventAvatar.jsx';
import EventPostCard from '../components/events/EventPostCard.jsx';
import SellItemCard from '../components/events/SellItemCard.jsx';
import Modal from '../components/events/Modal.jsx';
import AddPostForm from '../components/events/AddPostForm.jsx';
import AddItemForm from '../components/events/AddItemForm.jsx';
import ChangePhotoForm from '../components/events/ChangePhotoForm.jsx';
import AddMembersForm from '../components/events/AddMembersForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { eventService } from '../services/eventService.js';
import { formatEventDate, formatEventTime, formatPrice, isEventOrganizer, isFollowingEvent } from '../utils/eventUtils.js';

// Options in the organizer drop-down menu (next to the "Add Post" button)
const ORGANIZER_MENU = [
  { key: 'item', label: 'Add item to sell' },
  { key: 'cover', label: 'Change cover photo' },
  { key: 'profile', label: 'Change profile photo' },
  { key: 'organizer', label: 'Add members as organizers' },
  { key: 'invite', label: 'Invite members' }
];

// Title of the pop-up for each option
const MODAL_TITLES = {
  post: 'Add Post',
  item: 'Add Item to Sell',
  cover: 'Change Cover Photo',
  profile: 'Change Profile Photo',
  organizer: 'Add Organizers',
  invite: 'Invite Members'
};

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // null = no pop-up open
  const [buyingItemId, setBuyingItemId] = useState(null);

  // Load the event and its posts when the page opens (or the id in the URL changes)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([eventService.getEvent(id), eventService.getEventPosts(id)])
      .then(([eventData, postData]) => {
        if (!cancelled) {
          setEvent(eventData);
          setPosts(postData);
        }
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not load this event.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const isOrganizer = isEventOrganizer(event, user?.id);
  const isFollowing = isFollowingEvent(event, user?.id);

  // ---------- Actions ----------

  const handleToggleFollow = async () => {
    try {
      const updatedEvent = await eventService.toggleFollow(event.id);
      setEvent(updatedEvent);
      toast.success(isFollowing ? 'Removed from your watchlist' : 'Added to your watchlist');
    } catch {
      toast.error('Could not update follow. Please try again.');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Event link copied! Share it with your friends.');
    } catch {
      toast.error('Could not copy the link.');
    }
  };

  const handleBuy = async (item) => {
    // NOTE: there is no real payment yet, we only ask the user to confirm
    const confirmed = window.confirm(`Get "${item.name}" for ${formatPrice(item.price)}?`);
    if (!confirmed) return;

    setBuyingItemId(item.id);
    try {
      await eventService.buyItem(event.id, item.id);
      toast.success('Done! You can see it in the Passes tab on the Events page.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not complete the purchase.');
    } finally {
      setBuyingItemId(null);
    }
  };

  // Replace one post in the list after it was liked / commented
  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  // Called by the organizer forms when they finish
  const handleEventUpdated = (updatedEvent) => {
    setEvent(updatedEvent);
    // Keep the pop-up open for adding more organizers / invites, close it for the others
    if (activeModal !== 'organizer' && activeModal !== 'invite') {
      setActiveModal(null);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setActiveModal(null);
  };

  const openModal = (key) => {
    setMenuOpen(false);
    setActiveModal(key);
  };

  // ---------- Loading / not found ----------

  if (loading || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">{loading ? 'Loading event...' : 'Event not found.'}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <main className="flex-1 min-w-0 p-6 max-w-7xl mx-auto space-y-6">
        {/* ==================== Header: cover, photo, name, buttons ==================== */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {/* Cover photo */}
          {event.coverPhoto ? (
            <img src={event.coverPhoto} alt="Event cover" className="h-56 w-full rounded-t-2xl object-cover" />
          ) : (
            <div className="h-56 w-full rounded-t-2xl bg-gray-200" />
          )}

          <div className="flex flex-wrap items-end justify-between gap-4 px-8 pb-6">
            {/* Profile photo, name and followers */}
            <div className="flex items-end gap-4 -mt-12">
              <div className="rounded-full border-4 border-white shadow-md">
                <EventAvatar event={event} size="w-24 h-24" textSize="text-3xl" />
              </div>
              <div className="mb-1">
                <h1 className="text-xl font-bold text-gray-900">{event.title}</h1>
                <p className="text-xs text-gray-400">{(event.followerIds || []).length} followers</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                title="Share this event"
                className="rounded-xl p-2.5 text-gray-600 hover:bg-gray-100"
              >
                <HiOutlineSpeakerphone className="h-6 w-6" />
              </button>

              {isOrganizer ? (
                // Organizer view: "Add Post" button + drop-down menu with more options
                <div className="relative">
                  <div className="flex overflow-hidden rounded-xl bg-gray-100">
                    <button
                      type="button"
                      onClick={() => openModal('post')}
                      className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                    >
                      <HiOutlinePlusCircle className="h-5 w-5" />
                      Add Post
                    </button>
                    <button
                      type="button"
                      onClick={() => setMenuOpen(!menuOpen)}
                      aria-label="More organizer options"
                      className="border-l border-gray-200 px-3 text-gray-700 hover:bg-gray-200"
                    >
                      <HiChevronDown className="h-5 w-5" />
                    </button>
                  </div>

                  {menuOpen && (
                    <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border border-gray-100 bg-white p-1.5 shadow-lg">
                      {ORGANIZER_MENU.map((option) => (
                        <button
                          key={option.key}
                          type="button"
                          onClick={() => openModal(option.key)}
                          className="block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                // Normal user view: Follow button
                <button
                  type="button"
                  onClick={handleToggleFollow}
                  className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold ${
                    isFollowing
                      ? 'bg-[#800000] text-white hover:bg-[#660000]'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isFollowing ? <HiCheckCircle className="h-5 w-5" /> : <HiOutlinePlusCircle className="h-5 w-5" />}
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ==================== Body: details + items (left), posts (right) ==================== */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column */}
          <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
            {/* Event details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h2 className="text-sm font-bold text-gray-900">Event Details</h2>

              <DetailRow icon={HiOutlineCalendar} label="Date" value={formatEventDate(event.startsAt)} />
              <DetailRow icon={HiOutlineClock} label="Time" value={formatEventTime(event.startsAt)} />
              <DetailRow icon={HiOutlineLocationMarker} label="Location" value={event.location} />

              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                  <HiOutlineUserGroup className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-400">Organized by</p>
                  <div className="flex flex-wrap gap-x-1 text-sm font-semibold text-gray-800">
                    {(event.organizers || []).map((organizer, index) => (
                      <span key={organizer.userId}>
                        <Link to={`/profile/${organizer.userId}`} className="hover:text-[#800000]">
                          {organizer.name}
                        </Link>
                        {index < event.organizers.length - 1 && ','}
                      </span>
                    ))}
                    {(event.organizers || []).length === 0 && <span>{event.organizerName}</span>}
                  </div>
                </div>
              </div>

              <p className="whitespace-pre-line border-t border-gray-100 pt-4 text-sm text-gray-600">{event.description}</p>
            </div>

            {/* Tickets and other items */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-900">Event Tickets and Other Items</h2>
              {(event.items || []).length === 0 && (
                <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray-400 shadow-sm border border-gray-100">
                  {isOrganizer ? 'Use "Add item to sell" in the menu to add tickets.' : 'No tickets available yet.'}
                </p>
              )}
              {(event.items || []).map((item) => (
                <SellItemCard key={item.id} item={item} onBuy={handleBuy} buying={buyingItemId === item.id} />
              ))}
            </div>
          </div>

          {/* Right column: event posts */}
          <div className="flex-1 min-w-0 space-y-4">
            <h2 className="text-sm font-bold text-gray-900">Event Posts</h2>
            {posts.length === 0 && (
              <p className="rounded-2xl bg-white p-8 text-center text-sm text-gray-400 shadow-sm border border-gray-100">
                No posts yet.
              </p>
            )}
            {posts.map((post) => (
              <EventPostCard
                key={post.id}
                post={post}
                event={event}
                currentUserId={user?.id}
                isFollowing={isFollowing}
                onToggleFollow={handleToggleFollow}
                onPostUpdated={handlePostUpdated}
              />
            ))}
          </div>
        </div>
      </main>

      {/* ==================== Organizer pop-ups ==================== */}
      {activeModal && (
        <Modal title={MODAL_TITLES[activeModal]} onClose={() => setActiveModal(null)}>
          {activeModal === 'post' && <AddPostForm event={event} onCreated={handlePostCreated} />}
          {activeModal === 'item' && <AddItemForm event={event} onUpdated={handleEventUpdated} />}
          {activeModal === 'cover' && <ChangePhotoForm event={event} type="cover" onUpdated={handleEventUpdated} />}
          {activeModal === 'profile' && <ChangePhotoForm event={event} type="profile" onUpdated={handleEventUpdated} />}
          {activeModal === 'organizer' && <AddMembersForm event={event} mode="organizer" onUpdated={handleEventUpdated} />}
          {activeModal === 'invite' && <AddMembersForm event={event} mode="invite" onUpdated={handleEventUpdated} />}
        </Modal>
      )}
    </div>
  );
};

// One row in the "Event Details" box (icon + label + value)
const DetailRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
      <Icon className="h-5 w-5 text-gray-600" />
    </div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default EventDetailsPage;
