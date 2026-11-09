import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  // Common style function for active and inactive links with automatic highlighting
  const linkClass = ({ isActive }) =>
    `flex items-center space-x-3 p-2.5 rounded-lg transition-colors text-xs font-medium ${
      isActive
        ? 'text-white bg-[#800000] shadow-sm'
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="text-2xl font-bold text-[#800000]">KelaniConnect</div>
        <nav className="space-y-2">
          <NavLink to="/home" className={linkClass}>Home</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
          <NavLink to="/friends" className={linkClass}>Friends</NavLink>
          <NavLink to="/jobs" className={linkClass}>Jobs</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink> 
        </nav>
      </div>

      <div className="space-y-2 border-t pt-4">
        <NavLink to="/settings" className={linkClass}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          </svg>
          <span>Settings</span>
        </NavLink>
        <NavLink to="/login" className="flex items-center space-x-3 text-red-600 p-2 rounded-lg hover:bg-red-50 text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;