import React from 'react';
import { Link } from 'react-router-dom';
import { HiUserGroup, HiOfficeBuilding, HiUser, HiAcademicCap } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext.jsx';

const ProfileStatsCard = ({ friendsCount = 106, orgsCount = 8 }) => {
  const { user } = useAuth();

  const name = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Kelaniya Student';
  const faculty = user?.faculty || 'Faculty of Computing & Technology';
  const degree = user?.degreeProgram || 'Undergraduate Student';

  return (
    <div className="w-full lg:w-80 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <Link to="/profile" className="flex items-center space-x-4 border-b border-gray-100 pb-4 group">
          <div className="w-14 h-14 rounded-2xl bg-[#800000]/10 text-[#800000] font-bold text-xl flex items-center justify-center flex-shrink-0 border border-[#800000]/20 group-hover:scale-105 transition-transform">
            {name.charAt(0)}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 group-hover:text-[#800000] transition-colors truncate">
              {name}
            </h3>
            <p className="text-xs text-[#800000] font-semibold truncate">{degree}</p>
            <p className="text-[11px] text-gray-400 truncate">{faculty}</p>
          </div>
        </Link>

        <div className="bg-gray-50 p-4 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm text-gray-600">
              <HiUserGroup className="w-4 h-4 mr-2 text-[#800000]" />
              Friends
            </span>
            <span className="font-bold text-[#800000]">{friendsCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center text-sm text-gray-600">
              <HiOfficeBuilding className="w-4 h-4 mr-2 text-[#800000]" />
              Organisations
            </span>
            <span className="font-bold text-[#800000]">{orgsCount}</span>
          </div>
        </div>

        <Link
          to="/profile"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs transition-colors border border-gray-200"
        >
          <HiUser className="w-4 h-4 text-[#800000]" />
          View Full Profile
        </Link>
      </div>

      {/* University info card */}
      <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
          <HiAcademicCap className="w-4 h-4 text-[#800000]" />
          University of Kelaniya
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          Connect with registered undergraduates, join faculty societies, and expand your student network.
        </p>
      </div>
    </div>
  );
};

export default ProfileStatsCard;
