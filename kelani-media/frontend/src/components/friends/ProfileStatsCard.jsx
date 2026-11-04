import React from 'react';

const ProfileStatsCard = ({ friendsCount = 106, orgsCount = 8 }) => (
  <div className="w-80 space-y-6">
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="flex items-center space-x-4 border-b border-gray-100 pb-4">
        <div className="w-14 h-14 rounded-full bg-gray-300 flex-shrink-0" />
        <div>
          <h3 className="font-bold text-gray-900">Your Profile</h3>
          <p className="text-xs text-gray-400">University of Kelaniya</p>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Friends
          </span>
          <span className="font-bold text-[#800000]">{friendsCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-[#800000]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m-5 0V11m0 5h5" />
            </svg>
            Organisations
          </span>
          <span className="font-bold text-[#800000]">{orgsCount}</span>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileStatsCard;