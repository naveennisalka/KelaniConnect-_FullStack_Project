import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { HiHome, HiUserGroup, HiBriefcase, HiUser, HiLogout, HiAcademicCap, HiCalendar } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext.jsx';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: 'Home', path: '/home', icon: HiHome },
    { name: 'Friends', path: '/friends', icon: HiUserGroup },
    { name: 'Jobs', path: '/jobs', icon: HiBriefcase },
    { name: 'Events', path: '/events', icon: HiCalendar },
    { name: 'Profile', path: '/profile', icon: HiUser },
  ];

  const studentName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Kelaniya Student';
  const studentEmail = user?.email || 'student@stu.kln.ac.lk';
  const facultyName = user?.faculty || 'University of Kelaniya';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6 flex flex-col justify-between sticky top-0 h-screen select-none">
      <div className="space-y-6">
        {/* Brand Header */}
        <NavLink to="/home" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-[#800000] flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <HiAcademicCap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold text-[#800000] tracking-tight">KelaniConnect</div>
            <div className="text-[10px] uppercase font-semibold text-gray-400 tracking-wider">Campus Portal</div>
          </div>
        </NavLink>

        {/* Navigation Items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#800000] text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile snippet & Sign out */}
      <div className="space-y-3 border-t border-gray-100 pt-4">
        <NavLink
          to="/profile"
          className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
        >
          <div className="w-10 h-10 rounded-full bg-[#800000]/10 text-[#800000] font-bold flex items-center justify-center text-sm border border-[#800000]/20">
            {studentName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#800000]">
              {studentName}
            </p>
            <p className="text-xs text-gray-400 truncate">{studentEmail}</p>
          </div>
        </NavLink>

        <button
          onClick={handleSignOut}
          type="button"
          className="w-full flex items-center space-x-3 px-3.5 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <HiLogout className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
