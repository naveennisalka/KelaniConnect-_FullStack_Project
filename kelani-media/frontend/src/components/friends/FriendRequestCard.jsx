import React from 'react';
import { Link } from 'react-router-dom';
import { HiCheck, HiX, HiUser } from 'react-icons/hi';

const FriendRequestCard = ({ req, onAccept, onReject }) => {
  const senderName = req?.senderName || `Student (${req?.senderId?.slice(-4) || 'Peer'})`;
  const faculty = req?.faculty || 'Faculty of Computing & Technology';

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-gray-200 transition-all">
      <Link to={`/profile/${req?.senderId || 'student_chamath'}`} className="flex items-center space-x-3 min-w-0 group">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-100 to-amber-100 text-[#800000] font-bold flex items-center justify-center flex-shrink-0 text-sm group-hover:scale-105 transition-transform border border-red-200">
          {senderName.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="font-bold text-gray-900 group-hover:text-[#800000] transition-colors text-sm truncate">
            {senderName}
          </div>
          <div className="text-xs text-gray-400 truncate">{faculty}</div>
          <div className="text-[11px] text-gray-400">Sent you a connection request</div>
        </div>
      </Link>

      <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
        <Link
          to={`/profile/${req?.senderId || 'student_chamath'}`}
          className="px-2.5 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          Profile
        </Link>
        <button
          onClick={() => onAccept(req?.id)}
          className="px-3 py-1.5 bg-[#800000] hover:bg-[#600000] text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
        >
          <HiCheck className="w-3.5 h-3.5" />
          Confirm
        </button>
        <button
          onClick={() => onReject(req?.id)}
          className="p-1.5 bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
          title="Decline request"
        >
          <HiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default FriendRequestCard;
