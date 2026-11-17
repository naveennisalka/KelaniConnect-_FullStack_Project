import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  HiAcademicCap, 
  HiUserGroup, 
  HiBriefcase, 
  HiUser, 
  HiOutlinePhotograph, 
  HiOutlineHeart, 
  HiHeart,
  HiOutlineChatAlt, 
  HiOutlineShare,
  HiSearch,
  HiCalendar,
  HiExternalLink,
  HiSparkles
} from 'react-icons/hi'
import Sidebar from '../components/sidebar/Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

const INITIAL_POSTS = [
  {
    id: 1,
    author: 'Malik Jayawardena',
    authorId: 'student_malik',
    faculty: 'Faculty of Computing & Technology',
    time: '2 hours ago',
    content: '🎉 Thrilled to announce that our team from University of Kelaniya won 1st Place at the National Hackathon 2026! Huge thanks to our mentors and colleagues at FCT for the continuous support.',
    likes: 42,
    hasLiked: false,
    comments: 8,
    tag: 'Achievement'
  },
  {
    id: 2,
    author: 'Sanduni Weerasinghe',
    authorId: 'student_sanduni',
    faculty: 'Faculty of Science',
    time: '4 hours ago',
    content: 'Looking for study partners for the upcoming Advanced Database Systems and Data Structures finals. Anyone interested in forming a library study group this week?',
    likes: 19,
    hasLiked: false,
    comments: 12,
    tag: 'Study Group'
  },
  {
    id: 3,
    author: 'Career Guidance Unit (CGU)',
    authorId: 'org_cgu',
    faculty: 'University Administration',
    time: 'Yesterday',
    content: '📢 Annual Kelani Tech Career Fair 2026 is officially open for student registrations! Top tech companies including WSO2, IFS, Sysco LABS, and Virtusa will be conducting on-campus internship interviews. Head over to the Jobs section to prepare.',
    likes: 85,
    hasLiked: true,
    comments: 24,
    tag: 'Official Announcement'
  }
]

const SUGGESTED_STUDENTS = [
  {
    id: 'student_chamath',
    name: 'Chamath Fernando',
    degree: 'BSc in Software Engineering',
    faculty: 'Faculty of Computing & Technology',
    mutual: 6
  },
  {
    id: 'student_nethmi',
    name: 'Nethmi Silva',
    degree: 'BSc (Hons) in Computer Science',
    faculty: 'Faculty of Science',
    mutual: 4
  },
  {
    id: 'student_ravindu',
    name: 'Ravindu Bandara',
    degree: 'BBA in Human Resource Management',
    faculty: 'Faculty of Commerce & Management',
    mutual: 2
  }
]

const Home = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [posts, setPosts] = useState(INITIAL_POSTS)
  const [newPostContent, setNewPostContent] = useState('')

  const studentName = user?.firstName || 'Student'

  const handleCreatePost = (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) {
      toast.error('Please enter something to post')
      return
    }

    const newPost = {
      id: Date.now(),
      author: `${user?.firstName || 'Student'} ${user?.lastName || ''}`.trim(),
      authorId: user?.id || 'current_user',
      faculty: user?.faculty || 'Faculty of Computing & Technology',
      time: 'Just now',
      content: newPostContent,
      likes: 0,
      hasLiked: false,
      comments: 0,
      tag: 'Campus Life'
    }

    setPosts([newPost, ...posts])
    setNewPostContent('')
    toast.success('Post published to campus feed!')
  }

  const handleToggleLike = (postId) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasLiked: !p.hasLiked,
          likes: p.hasLiked ? p.likes - 1 : p.likes + 1
        }
      }
      return p
    }))
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800">
      <Sidebar />

      <main className="flex-1 min-w-0 p-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Feed Column */}
        <div className="flex-1 space-y-6">
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-[#800000] to-[#500000] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-medium tracking-wide uppercase mb-3">
                <HiSparkles className="w-4 h-4 text-amber-300" /> KelaniConnect Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {studentName}! 🎓
              </h1>
              <p className="text-white/80 text-sm mt-1 max-w-xl">
                Stay updated with University of Kelaniya announcements, connect with friends, and discover exciting job opportunities.
              </p>

              {/* Quick links */}
              <div className="flex flex-wrap gap-3 mt-4 pt-2">
                <Link
                  to="/friends"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#800000] rounded-xl text-xs sm:text-sm font-semibold hover:bg-white/90 shadow-sm transition-all"
                >
                  <HiUserGroup className="w-4 h-4" />
                  Find Friends
                </Link>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  <HiBriefcase className="w-4 h-4" />
                  Explore Jobs
                </Link>
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  <HiUser className="w-4 h-4" />
                  My Profile
                </Link>
              </div>
            </div>

            {/* Background design elements */}
            <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute right-12 top-2 w-24 h-24 bg-white/5 rounded-full pointer-events-none" />
          </div>

          {/* Create Post Box */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#800000]/10 text-[#800000] font-bold flex items-center justify-center flex-shrink-0 text-sm border border-[#800000]/20">
                {studentName.charAt(0)}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share a campus update, ask a question, or discuss an event..."
                  rows={3}
                  className="w-full text-sm placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#800000] resize-none"
                />
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <button type="button" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <HiOutlinePhotograph className="w-4 h-4 text-emerald-600" />
                      <span>Photo</span>
                    </button>
                    <button type="button" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <HiCalendar className="w-4 h-4 text-blue-600" />
                      <span>Event</span>
                    </button>
                  </div>
                  <button
                    onClick={handleCreatePost}
                    type="button"
                    className="px-5 py-2 bg-[#800000] hover:bg-[#660000] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
                  >
                    Post Update
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Feed Posts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Campus Activity</h2>
              <span className="text-xs text-gray-500 font-medium">Latest Updates</span>
            </div>

            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.authorId}`} className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 font-bold flex items-center justify-center flex-shrink-0 text-sm hover:ring-2 hover:ring-[#800000] transition-all">
                      {post.author.charAt(0)}
                    </Link>
                    <div>
                      <Link to={`/profile/${post.authorId}`} className="font-bold text-gray-900 hover:text-[#800000] transition-colors text-sm">
                        {post.author}
                      </Link>
                      <p className="text-xs text-gray-400">{post.faculty} • {post.time}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                    {post.tag}
                  </span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                <div className="flex items-center gap-6 pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${post.hasLiked ? 'text-red-600 font-semibold' : 'hover:text-red-600'}`}
                  >
                    {post.hasLiked ? <HiHeart className="w-5 h-5 text-red-600" /> : <HiOutlineHeart className="w-5 h-5" />}
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                    <HiOutlineChatAlt className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                  <button 
                    onClick={() => toast.success('Link copied to clipboard!')}
                    className="flex items-center gap-1.5 hover:text-gray-800 transition-colors ml-auto"
                  >
                    <HiOutlineShare className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Widgets */}
        <div className="w-full lg:w-80 space-y-6">
          {/* Quick Profile Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="text-center pb-4 border-b border-gray-100">
              <div className="w-16 h-16 rounded-full bg-[#800000]/10 text-[#800000] font-bold text-xl flex items-center justify-center mx-auto mb-3 border-2 border-[#800000]/20">
                {studentName.charAt(0)}
              </div>
              <h3 className="font-bold text-gray-900 text-base">{studentName} {user?.lastName || ''}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{user?.faculty || 'Faculty of Computing & Technology'}</p>
              <p className="text-xs text-[#800000] font-medium mt-1">{user?.degreeProgram || 'Undergraduate Student'}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center py-4 border-b border-gray-100">
              <Link to="/friends" className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <span className="block text-lg font-bold text-gray-900">106</span>
                <span className="text-xs text-gray-400">Friends</span>
              </Link>
              <Link to="/jobs" className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <span className="block text-lg font-bold text-gray-900">12</span>
                <span className="text-xs text-gray-400">Saved Jobs</span>
              </Link>
            </div>

            <div className="pt-4">
              <Link
                to="/profile"
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs transition-colors border border-gray-200"
              >
                <HiUser className="w-4 h-4 text-[#800000]" />
                View Full Profile
              </Link>
            </div>
          </div>

          {/* Suggested Student Profiles */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Suggested Profiles</h3>
              <Link to="/friends" className="text-xs text-[#800000] font-semibold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {SUGGESTED_STUDENTS.map((student) => (
                <div key={student.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <Link to={`/profile/${student.id}`} className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 font-bold text-gray-600 flex items-center justify-center text-xs flex-shrink-0">
                      {student.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-800 truncate hover:text-[#800000]">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">{student.degree}</p>
                    </div>
                  </Link>

                  <Link
                    to={`/profile/${student.id}`}
                    className="px-2.5 py-1 text-xs font-semibold bg-[#800000]/10 text-[#800000] hover:bg-[#800000] hover:text-white rounded-lg transition-colors flex-shrink-0"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Campus Jobs Preview */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 text-sm">Featured Internships</h3>
              <Link to="/jobs" className="text-xs text-[#800000] font-semibold hover:underline">
                Explore All
              </Link>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">Internship</span>
                <p className="text-xs font-bold text-gray-800">Software Engineer Intern</p>
                <p className="text-[11px] text-gray-500">WSO2 • Colombo / Hybrid</p>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md">Part-Time</span>
                <p className="text-xs font-bold text-gray-800">Student Demonstrator (TA)</p>
                <p className="text-[11px] text-gray-500">Department of Statistics & CS</p>
              </div>
            </div>

            <Link
              to="/jobs"
              className="block text-center text-xs font-semibold text-[#800000] hover:underline pt-1"
            >
              Browse 20+ more student opportunities →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
