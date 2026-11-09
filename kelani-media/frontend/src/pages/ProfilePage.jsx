import React, { useState } from 'react';
import Sidebar from '../components/sidebar/Sidebar';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('Posts');

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto space-y-6">
        
        {/* Profile Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Cover Photo */}
          <div className="w-full h-48 bg-gray-200"></div>

          {/* Profile Details Bar */}
          <div className="px-8 pb-6 flex justify-between items-end relative">
            <div className="flex items-end gap-4 -mt-12">
              <div className="w-24 h-24 rounded-full bg-gray-300 border-4 border-white shadow-md"></div>
              <div className="mb-1">
                <h2 className="text-lg font-bold text-gray-800">Nethmi Bhagya</h2>
                <p className="text-xs text-gray-400">Electronics and Computer Science Undergraduate , UoK</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-5 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm">
                Add Friend
              </button>
            </div>
          </div>

          {/* Tabs Navigation (Posts, Events, Info) */}
          <div className="flex gap-8 border-t border-gray-100 px-8">
            {['Posts', 'Events', 'Info'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-xs font-semibold transition-colors relative ${
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
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
          {activeTab === 'Posts' && <div className="text-xs text-gray-400 text-center py-12">Posts Grid Content Loading...</div>}
          {activeTab === 'Events' && <div className="text-xs text-gray-400 text-center py-12">Events Content Loading...</div>}
          {activeTab === 'Info' && <div className="text-xs text-gray-400 text-center py-12">User Info Details Loading...</div>}
        </div>
        {/* Dynamic Tab Content Area */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
          {activeTab === 'Posts' && (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-800">Recent Posts</h3>
              {/* Instagram Style 3-Column Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="bg-gray-100 rounded-xl h-48 flex items-center justify-center border border-gray-200 hover:opacity-90 transition-opacity cursor-pointer">
                    <span className="text-xs text-gray-400 font-medium">Post Image {item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Events' && (
            <div className="text-xs text-gray-400 text-center py-12">Events Content Loading...</div>
          )}

          {activeTab === 'Info' && (
            <div className="text-xs text-gray-400 text-center py-12">User Info Details Loading...</div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;