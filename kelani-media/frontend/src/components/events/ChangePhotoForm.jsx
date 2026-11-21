import React, { useState } from 'react';
import toast from 'react-hot-toast';
import ImagePicker from './ImagePicker.jsx';
import { eventService } from '../../services/eventService.js';

// Change the event profile photo (type = "profile") or cover photo (type = "cover")
const ChangePhotoForm = ({ event, type, onUpdated }) => {
  const isCover = type === 'cover';
  const [photo, setPhoto] = useState(isCover ? event.coverPhoto || '' : event.profilePhoto || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Only send the photo we are changing
      const photos = isCover ? { coverPhoto: photo } : { profilePhoto: photo };
      const updatedEvent = await eventService.updatePhotos(event.id, photos);
      toast.success('Photo updated!');
      onUpdated(updatedEvent);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update the photo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <ImagePicker
        value={photo}
        onChange={setPhoto}
        shape={isCover ? 'cover' : 'circle'}
        maxWidth={isCover ? 1600 : 400}
      />
      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="w-full rounded-xl bg-[#800000] py-3 text-sm font-semibold text-white hover:bg-[#660000] disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Photo'}
      </button>
    </div>
  );
};

export default ChangePhotoForm;
