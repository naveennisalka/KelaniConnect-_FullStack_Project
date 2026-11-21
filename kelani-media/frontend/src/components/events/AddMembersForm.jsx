import React from 'react';
import toast from 'react-hot-toast';
import UserPicker from './UserPicker.jsx';
import { eventService } from '../../services/eventService.js';

// mode = "organizer" -> add students as event organizers
// mode = "invite"    -> invite students to follow the event
const AddMembersForm = ({ event, mode, onUpdated }) => {
  const isOrganizerMode = mode === 'organizer';

  // Students that should not show in the search results
  const organizerIds = (event.organizers || []).map((organizer) => organizer.userId);
  const excludeIds = isOrganizerMode
    ? organizerIds
    : [...(event.followerIds || []), ...(event.invitedIds || [])];

  const handleSelect = async (student) => {
    try {
      const updatedEvent = isOrganizerMode
        ? await eventService.addOrganizer(event.id, student.id)
        : await eventService.inviteMember(event.id, student.id);

      toast.success(isOrganizerMode
        ? `${student.firstName} is now an organizer`
        : `Invitation sent to ${student.firstName}`);
      onUpdated(updatedEvent);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="space-y-5">
      {isOrganizerMode && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-gray-400">Current organizers</p>
          <div className="flex flex-wrap gap-2">
            {(event.organizers || []).map((organizer) => (
              <span key={organizer.userId} className="rounded-full bg-[#800000]/10 px-3 py-1 text-xs font-semibold text-[#800000]">
                {organizer.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isOrganizerMode && (
        <p className="text-sm text-gray-500">
          Invited students will see this event in their Watchlist tab and can follow it.
        </p>
      )}

      <UserPicker
        onSelect={handleSelect}
        excludeIds={excludeIds}
        buttonLabel={isOrganizerMode ? 'Make organizer' : 'Invite'}
      />
    </div>
  );
};

export default AddMembersForm;
