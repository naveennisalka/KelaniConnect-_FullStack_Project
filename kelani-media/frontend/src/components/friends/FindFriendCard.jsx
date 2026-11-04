import React from 'react';

const FindFriendCard = ({ user, onAdd }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" />
      <div>
        <div className="font-semibold text-gray-900">{user?.name || 'Sample Student'}</div>
        <div className="text-xs text-gray-400">Department of Statistics & Computer Science</div>
      </div>
    </div>
    <button
      onClick={() => onAdd(user?.id)}
      className="px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-sm font-medium transition-colors"
    >
      Add Friend
    </button>
  </div>
);

export default FindFriendCard;