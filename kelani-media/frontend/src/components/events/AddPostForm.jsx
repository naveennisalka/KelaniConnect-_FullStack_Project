import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ImagePicker from './ImagePicker.jsx';
import { eventService } from '../../services/eventService.js';

// Form for organizers to publish a new post on the event page
const AddPostForm = ({ event, onCreated }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Please write something for the post.');
      return;
    }

    setSaving(true);
    try {
      const post = await eventService.createPost({ eventId: event.id, content, imageUrl });
      toast.success('Post published!');
      onCreated(post);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not publish the post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={5000}
        rows={4}
        placeholder="Share an update about your event..."
        className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm focus:border-[#800000] focus:ring-2 focus:ring-[#800000]/10"
      />
      <ImagePicker value={imageUrl} onChange={setImageUrl} shape="square" />
      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-xl bg-[#800000] py-3 text-sm font-semibold text-white hover:bg-[#660000] disabled:opacity-50"
      >
        {saving ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  );
};

export default AddPostForm;
