import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';

const JobsPage = () => {
  const [activeTab, setActiveTab] = useState('Jobs');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Mock data for Jobs tab
  const availableJobs = [
    {
      id: 1,
      title: 'Campus Event Photographer Needed',
      society: 'Electronic student society',
      location: 'Dharmaloca hall, uok',
      stipend: '5000 LKR',
      description: 'Looking for an experienced student photographer to cover the annual tech hackathon event.'
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

  // Mock data for Ongoing tab
  const ongoingJobs = [
    {
      id: 1,
      title: 'Mobile App Bug Fixing & Testing',
      society: 'Computer Science Circle',
      location: 'Lab 03 / Remote',
      timeLeft: '1d 3h 36m',
      description: 'Fix navigation bugs and test responsiveness for the departmental mobile application.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col lg:flex-row p-6 gap-6 max-w-7xl mx-auto">
        
        {/* Center Feed Area */}
        <div className="flex-1 space-y-6">
          
          {/* Top Search Bar */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center px-4 gap-3">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Find Friends, Jobs, Gigs..."
              className="w-full bg-transparent text-xs focus:outline-none text-gray-700"
            />
          </div>

          {/* Tabs (Jobs / Ongoing) */}
          <div className="flex gap-6 border-b border-gray-200 px-2">
            {['Jobs', 'Ongoing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 text-xs font-semibold transition-colors relative ${
                  activeTab === tab ? 'text-[#800000]' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#800000] rounded-full"></div>
                )}
              </button>
            ))}
          </div>

          {/* Conditional Content Based on Tabs */}
          {activeTab === 'Jobs' ? (
            <div className="space-y-4">
              {availableJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{job.title}</h3>
                        <p className="text-[11px] text-gray-400">{job.society} • {job.location}</p>
                      </div>
                    </div>
                    <span className="bg-rose-50 text-[#800000] text-[10px] font-semibold px-3 py-1 rounded-full border border-rose-100">
                      {job.stipend}
                    </span>
                  </div>
                  
                  {/* Wireframe Placeholder Box */}
                  <div className="w-full h-36 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 text-xs">
                    [ Job Preview Banner / Image ]
                  </div>

                  <div className="flex justify-end pt-2">
                    <button className="w-full bg-[#3d4451] text-white text-xs font-medium py-2.5 rounded-xl hover:bg-[#2d323c] transition-colors shadow-sm">
                      Apply Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {ongoingJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                      <div>
                        <h3 className="text-sm font-bold text-gray-800">{job.title}</h3>
                        <p className="text-[11px] text-gray-400">{job.society}</p>
                      </div>
                    </div>
                  </div>

                  {/* Wireframe Placeholder Box */}
                  <div className="w-full h-36 bg-gray-50 border border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300 text-xs">
                    [ Active Task Workspace ]
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button
                      onClick={() => setShowSubmitModal(true)}
                      className="bg-[#3d4451] text-white text-xs font-medium px-6 py-2.5 rounded-xl hover:bg-[#2d323c] transition-colors shadow-sm"
                    >
                      Submit work
                    </button>
                    <span className="text-xs font-medium text-gray-500">
                      Time Left : {job.timeLeft}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Right Sidebar Profile & Widgets */}
        <div className="w-full lg:w-80 space-y-6">
          
          {/* User Profile Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-300"></div>
              <div>
                <div className="w-28 h-3 bg-gray-200 rounded mb-1.5"></div>
                <div className="w-16 h-2.5 bg-gray-100 rounded"></div>
              </div>
            </div>
            {/* Star Rating */}
            <div className="flex gap-1 text-amber-400 text-sm pt-1">
              ★ ★ ★ ★ ☆
            </div>
          </div>

          {/* My Earnings Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
            <h4 className="text-xs font-bold text-gray-700">My Earnings</h4>
            <div className="w-full h-10 bg-gray-100 rounded-xl flex items-center px-4 text-xs font-semibold text-gray-500">
              15,000 LKR
            </div>
          </div>

          {/* Skills Toggle Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
            <h4 className="text-xs font-bold text-gray-700">Skills</h4>
            <div className="space-y-3">
              {['React & Tailwind', 'UI/UX Design', 'Python / ML', 'Photography'].map((skill, index) => (
                <div key={index} className="flex justify-between items-center text-xs">
                  <span className="text-gray-600 font-medium">{skill}</span>
                  <div className="w-8 h-4 bg-[#800000] rounded-full relative p-0.5 flex items-center justify-end cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Submit Work Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-xl p-6 space-y-5 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                <div>
                  <h4 className="text-xs font-bold text-gray-800">Submit Task Files</h4>
                  <p className="text-[10px] text-gray-400">Time Left : 1d 3h 36m</p>
                </div>
              </div>
              <span className="bg-rose-50 text-[#800000] text-xs font-bold px-3 py-1 rounded-xl">
                100 Points
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-600 mb-1.5">Add Files</label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 hover:border-rose-900 transition-colors cursor-pointer">
                  Drag & drop your deliverables or browse files
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-600 mb-1.5">Comments</label>
                <div className="border border-gray-200 rounded-xl overflow-hidden">
                  <textarea rows="3" placeholder="Rich text editor..." className="w-full p-3 focus:outline-none text-xs"></textarea>
                  <div className="bg-gray-50 border-t border-gray-200 px-3 py-2 flex gap-3 text-gray-500 font-bold">
                    <span>B</span>
                    <span>I</span>
                    <span>S</span>
                    <span>•=</span>
                    <span>&lt;/&gt;</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button onClick={() => setShowSubmitModal(false)} className="w-full py-2.5 bg-[#3d4451] text-white text-xs font-medium rounded-xl hover:bg-[#2d323c]">
                Submit work
              </button>
              <button onClick={() => setShowSubmitModal(false)} className="w-full py-2.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-200">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default JobsPage;