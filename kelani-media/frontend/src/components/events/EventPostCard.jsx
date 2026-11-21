import React, { useState } from 'react';
import {
  HiOutlineBookmark,
  HiBookmark,
  HiOutlineThumbUp,
  HiThumbUp,
  HiOutlineChatAlt2
} from 'react-icons/hi';
import toast from 'react-hot-toast';
import EventAvatar from './EventAvatar.jsx';
import { eventService } from '../../services/eventService.js';

// One post on the event page: header, photo, text, like + comment buttons.
// When the post changes (like / comment) we send the new post to the parent with onPostUpdated.
const EventPostCard = ({ post, event, currentUserId, isFollowing, onToggleFollow, onPostUpdated }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const likes = post.likedBy || [];
  const comments = post.comments || [];
  const hasLiked = likes.includes(currentUserId);

  const handleLike = async () => {
    try {
      onPostUpdated(await eventService.toggleLike(post.id));
    } catch {
      toast.error('Could not update your like. Please try again.');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      onPostUpdated(await eventService.addComment(post.id, commentText.trim()));
      setCommentText('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add your comment.');
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 bg-gray-50 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <EventAvatar event={event} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-900">{event.title}</p>
            <p className="text-xs text-gray-400">
              {post.authorName} · {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleFollow}
          title={isFollowing ? 'Remove from watchlist' : 'Add to watchlist'}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
        >
          {isFollowing ? <HiBookmark className="h-6 w-6 text-[#800000]" /> : <HiOutlineBookmark className="h-6 w-6" />}
        </button>
      </div>

      {/* Photo and text */}
      {post.imageUrl && <img src={post.imageUrl} alt="Event post" loading="lazy" className="max-h-[480px] w-full bg-gray-200 object-cover" />}
      <p className="whitespace-pre-line px-5 pt-4 text-sm text-gray-700">{post.content}</p>

      {/* Like and comment buttons */}
      <div className="flex items-center gap-6 px-5 py-4 text-sm text-gray-500">
        <button
          type="button"
          onClick={handleLike}
          className={`flex items-center gap-1.5 ${hasLiked ? 'font-semibold text-[#800000]' : 'hover:text-[#800000]'}`}
        >
          {hasLiked ? <HiThumbUp className="h-6 w-6" /> : <HiOutlineThumbUp className="h-6 w-6" />}
          <span>{likes.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 hover:text-[#800000]"
        >
          <HiOutlineChatAlt2 className="h-6 w-6" />
          <span>{comments.length}</span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <div className="space-y-3 border-t border-gray-100 px-5 py-4">
          {comments.length === 0 && <p className="text-sm text-gray-400">No comments yet.</p>}
          {comments.map((comment) => (
            <p key={comment.id} className="text-sm">
              <span className="font-semibold text-gray-800">{comment.authorName}</span>
              <span className="text-gray-600"> {comment.content}</span>
            </p>
          ))}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              maxLength={1000}
              placeholder="Write a comment..."
              className="min-w-0 flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={!commentText.trim()}
              className="rounded-lg bg-[#800000] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </article>
  );
};

export default EventPostCard;
