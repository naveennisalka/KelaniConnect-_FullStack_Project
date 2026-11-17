import React from 'react';
import { Link } from 'react-router-dom';
import { HiUser, HiUserAdd, HiCheck } from 'react-icons/hi';

const FindFriendCard = ({ user, onAdd, isAdded }) => (
  <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:border-[#800000]/20 transition-all">
    <Link to={`/profile/${user?.id}`} className="flex items-center space-x-3 min-w-0 group">
      <div className="w-12 h-12 rounded-full bg-[#800000]/10 text-[#800000] font-bold flex items-center justify-center flex-shrink-0 text-sm group-hover:scale-105 transition-transform border border-[#800000]/20">
        {(user?.name || 'S').charAt(0)}
      </div>
      <div className="min-w-0">
        <div className="font-bold text-gray-900 group-hover:text-[#800000] transition-colors text-sm truncate">
          {user?.name || 'Sample Student'}
        </div>
        <div className="text-xs text-gray-400 truncate">
          {user?.faculty || 'Department of Statistics & Computer Science'}
        </div>
        <div className="text-[11px] text-[#800000] font-medium mt-0.5">
          {user?.degree || 'BSc Undergraduate'}
        </div>
      </div>
    </Link>

    <div className="flex items-center gap-2 flex-shrink-0 ml-3">
      <Link
        to={`/profile/${user?.id}`}
        className="px-3 py-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      >
        View Profile
      </Link>
      <button
        onClick={() => onAdd(user?.id)}
        disabled={isAdded}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
          isAdded
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-[#800000] hover:bg-[#600000] text-white shadow-sm'
        }`}
      >
        {isAdded ? (
          <>
            <HiCheck className="w-3.5 h-3.5" /> Sent
          </>
        ) : (
          <>
            <HiUserAdd className="w-3.5 h-3.5" /> Add
          </>
        )}
      </button>
    </div>
  </div>
);

export default FindFriendCard;
