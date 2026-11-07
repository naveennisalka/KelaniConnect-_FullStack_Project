import React, { useState } from 'react';

const JobsPage = () => {
  const [activeTab, setActiveTab] = useState('All Jobs');

  const jobsList = [
    {
      id: 1,
      title: 'Campus Event Photographer Needed',
      society: 'Electronic student society',
      location: 'Dharmaloca hall,uok',
      stipend: '4500 LKR',
      description: 'Looking for an experienced student photographer to cover the AGM.'
    },
    {
      id: 2,
      title: 'UI/UX Design Assistant for Club Web App',
      society: 'IEEE Student Branch',
      location: 'Remote / Lab',
      stipend: 'Certificate + Perks',
      description: 'Help design promotional banners and UI components for upcoming faculty events.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="flex-1 p-6 space-y-6 max-w-5xl mx-auto">
        
        {/* Search Bar */}
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

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-gray-200 pb-2">
          {['All Jobs', 'Ongoing'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === tab ? 'bg-[#800000] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Job Cards */}
        <div className="space-y-4">
          {jobsList.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{job.title}</h3>
                  <p className="text-xs text-gray-400">{job.society} • {job.location}</p>
                </div>
                <span className="bg-rose-50 text-[#800000] text-[10px] font-semibold px-2.5 py-1 rounded-full border border-rose-100">
                  {job.stipend}
                </span>
              </div>
              <p className="text-xs text-gray-600">{job.description}</p>
              <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                <span className="text-[10px] text-gray-400">Posted 2 days ago</span>
                <button className="bg-[#800000] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-rose-900 transition-colors">
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default JobsPage;