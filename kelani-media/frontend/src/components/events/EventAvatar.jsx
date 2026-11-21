import React from 'react';

// Round event profile photo. If there is no photo we show the first letter of the event name.
const EventAvatar = ({ event, size = 'w-12 h-12', textSize = 'text-base' }) => {
  if (event?.profilePhoto) {
    return (
      <img
        src={event.profilePhoto}
        alt={event.title}
        className={`${size} flex-shrink-0 rounded-full bg-gray-200 object-cover`}
      />
    );
  }

  return (
    <div className={`${size} ${textSize} flex flex-shrink-0 items-center justify-center rounded-full bg-[#800000]/10 font-bold text-[#800000]`}>
      {(event?.title || 'E').charAt(0).toUpperCase()}
    </div>
  );
};

export default EventAvatar;
