import React, { useState } from 'react';

const JobsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content Area */}
      <div className="flex-1 p-6 space-y-6 max-w-5xl mx-auto">
        
        {/* Top Search & Post Job Action Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search campus jobs, gigs, roles..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-900"
          />
          <button className="bg-[#800000] text-white text-xs font-medium px-5 py-2.5 rounded-xl hover:bg-rose-900 whitespace-nowrap shadow-sm transition-colors">
            + Post Job
          </button>
        </div>

      </div>
    </div>
  );
};

export default JobsPage;