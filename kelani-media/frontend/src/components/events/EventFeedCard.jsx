import React from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineBookmark, HiBookmark, HiOutlineExternalLink, HiOutlineShare } from 'react-icons/hi';
import toast from 'react-hot-toast';
import EventAvatar from './EventAvatar.jsx';
import { formatEventDate } from '../../utils/eventUtils.js';

// One card in the events feed.
// If "post" is given we show that event post, otherwise we show the event itself (new event card).
const EventFeedCard = ({ event, post, isFollowing, onToggleFollow }) => {
  const eventLink = `/events/${event.id}`;
  const image = post ? post.imageUrl : event.coverPhoto;
  const text = post ? post.content : event.description;
  const subtitle = post
    ? `Posted ${new Date(post.createdAt).toLocaleDateString()}`
    : `New event · ${formatEventDate(event.startsAt)}`;

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${eventLink}`);
      toast.success('Event link copied!');
    } catch {
      toast.error('Could not copy the link.');
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header: event photo + name, bookmark = add to watchlist */}
      <div className="flex items-center justify-between gap-3 bg-gray-50 p-4">
        <Link to={eventLink} className="flex min-w-0 items-center gap-3">
          <EventAvatar event={event} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900 hover:text-[#800000]">{event.title}</p>
            <p className="text-xs text-gray-400">{subtitle}</p>
          </div>
        </Link>
        <button
          type="button"
          onClick={onToggleFollow}
          title={isFollowing ? 'Remove from watchlist' : 'Add to watchlist'}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
        >
          {isFollowing ? <HiBookmark className="h-6 w-6 text-[#800000]" /> : <HiOutlineBookmark className="h-6 w-6" />}
        </button>
      </div>

      {/* Photo */}
      <Link to={eventLink} className="block">
        {image ? (
          <img src={image} alt={event.title} loading="lazy" className="h-72 w-full bg-gray-200 object-cover" />
        ) : (
          <div className="h-72 w-full bg-gray-200" />
        )}
      </Link>

      {text && <p className="line-clamp-3 whitespace-pre-line px-4 pt-3 text-sm text-gray-700">{text}</p>}

      {/* Footer: Get Tickets + Share */}
      <div className="flex items-center justify-between bg-gray-50 p-4 mt-3">
        <Link
          to={eventLink}
          className="flex items-center gap-2 rounded-xl bg-[#800000] px-4 py-2 text-xs font-semibold text-white hover:bg-[#660000]"
        >
          <HiOutlineExternalLink className="h-4 w-4" />
          Get Tickets
        </Link>
        <button
          type="button"
          onClick={handleShare}
          title="Share"
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
        >
          <HiOutlineShare className="h-6 w-6" />
        </button>
      </div>
    </article>
  );
};

export default EventFeedCard;
