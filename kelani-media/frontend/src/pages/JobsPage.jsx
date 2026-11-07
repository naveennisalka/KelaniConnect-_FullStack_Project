import React, { useState } from 'react';

const JobsPage = () => {
  const [activeTab, setActiveTab] = useState('All Jobs');
  const [showPostModal, setShowPostModal] = useState(false);

  const jobsList = [
    {
      id: 1,
      title: 'Campus Event Photographer Needed',
      society: 'Electronic student society',
      location: 'University Auditorium',
      stipend: '4500 LKR',
      description: 'Looking for an experienced student photographer to cover the annual general meeting 2027.'
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
        
        {/* Search & Action Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between gap-4">
          <input
            type="text"
            placeholder="Search campus jobs, gigs, roles..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-rose-900"
          />
          <button
            onClick={() => setShowPostModal(true)}
            className="bg-[#800000] text-white text-xs font-medium px-5 py-2.5 rounded-xl hover:bg-rose-900 whitespace-nowrap shadow-sm transition-colors"
          >
            + Post Job
          </button>
        </div>

        {/* Tabs */}
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

        {/* Job Cards Feed */}
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

      {/* Post Job Modal Form */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-gray-800">Post a New Campus Job</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-gray-600 mb-1">Job Title</label>
                <input type="text" placeholder="e.g. Event Coordinator" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-rose-900" />
              </div>
              <div>
                <label className="block font-medium text-gray-600 mb-1">Description & Requirements</label>
                <textarea rows="3" placeholder="Write requirements..." className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-rose-900"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button onClick={() => setShowPostModal(false)} className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={() => setShowPostModal(false)} className="px-4 py-2 text-xs bg-[#800000] text-white rounded-lg hover:bg-rose-900">Post Job</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsPage;