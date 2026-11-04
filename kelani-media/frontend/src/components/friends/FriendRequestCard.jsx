import React from 'react';

const FriendRequestCard = ({ req, onAccept, onReject }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm">
    <div className="flex items-center space-x-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 flex-shrink-0" />
      <div>
        <div className="font-semibold text-gray-900">User ID: {req?.senderId || 'Unknown'}</div>
        <div className="text-xs text-gray-400">Sent you a friend request</div>
      </div>
    </div>
    <div className="flex space-x-2">
      <button
        onClick={() => onAccept(req?.id)}
        className="px-4 py-2 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-sm font-medium transition-colors"
      >
        Confirm
      </button>
      <button
        onClick={() => onReject(req?.id)}
        className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
);

export default FriendRequestCard;