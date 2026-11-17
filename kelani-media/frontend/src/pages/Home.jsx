import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  HiCalendar,
  HiSparkles
} from 'react-icons/hi'
import Sidebar from '../components/sidebar/Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { postService } from '../services/postService.js'
import { userService } from '../services/userService.js'
import { jobService } from '../services/jobService.js'
import toast from 'react-hot-toast'

const mapPost = (post, currentUserId) => ({
  ...post,
  author: post.authorName,
  authorId: post.authorId,
  likes: post.likedBy.length,
  hasLiked: post.likedBy.includes(currentUserId),
  commentsCount: post.comments.length,
  time: new Date(post.createdAt).toLocaleString()
})

const Home = () => {
  const { user } = useAuth()

  const [posts, setPosts] = useState([])
  const [suggestedStudents, setSuggestedStudents] = useState([])
  const [featuredJobs, setFeaturedJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPostContent, setNewPostContent] = useState('')
  const [newPostImageUrl, setNewPostImageUrl] = useState('')
  const [expandedComments, setExpandedComments] = useState(null)
  const [commentDrafts, setCommentDrafts] = useState({})

  const studentName = user?.firstName || 'Student'

  useEffect(() => {
    let cancelled = false
    const loadHomeData = async () => {
      try {
        const [feed, students, jobs] = await Promise.all([
          postService.getFeed(),
          userService.discover(),
          jobService.getJobs()
        ])
        if (!cancelled) {
          setPosts(feed.map((post) => mapPost(post, user?.id)))
          setSuggestedStudents(students)
          setFeaturedJobs(jobs)
        }
      } catch {
        if (!cancelled) toast.error('Could not load the campus feed. Please refresh and try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadHomeData()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!newPostContent.trim()) {
      toast.error('Please enter something to post')
      return
    }

    try {
      const post = await postService.createPost({
        content: newPostContent,
        tag: 'Campus Life',
        mediaUrl: newPostImageUrl
      })
      setPosts((currentPosts) => [mapPost(post, user?.id), ...currentPosts])
      setNewPostContent('')
      setNewPostImageUrl('')
      toast.success('Post published to campus feed!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not publish the post. Please try again.')
    }
  }

  const handleToggleLike = async (postId) => {
    try {
      const updatedPost = await postService.toggleLike(postId)
      setPosts((currentPosts) => currentPosts.map((post) => (
        post.id === postId ? mapPost(updatedPost, user?.id) : post
      )))
    } catch {
      toast.error('Could not update your like. Please try again.')
    }
  }

  const handleAddComment = async (e, postId) => {
    e.preventDefault()
    const content = commentDrafts[postId]?.trim()
    if (!content) return

    try {
      const updatedPost = await postService.addComment(postId, content)
      setPosts((currentPosts) => currentPosts.map((post) => (
        post.id === postId ? mapPost(updatedPost, user?.id) : post
      )))
      setCommentDrafts((drafts) => ({ ...drafts, [postId]: '' }))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add your comment. Please try again.')
    }
  }

  const handleShare = async (postId) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/home#post-${postId}`)
      toast.success('Link copied to clipboard!')
    } catch {
      toast.error('Could not copy the post link.')
    }
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
                  to="/events"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all backdrop-blur-sm"
                >
                  <HiCalendar className="w-4 h-4" />
                  Campus Events
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
            <form onSubmit={handleCreatePost} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#800000]/10 text-[#800000] font-bold flex items-center justify-center flex-shrink-0 text-sm border border-[#800000]/20">
                {studentName.charAt(0)}
              </div>
              <div className="flex-1">
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  maxLength={5000}
                  placeholder="Share a campus update, ask a question, or discuss an event..."
                  rows={3}
                  className="w-full text-sm placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#800000] resize-none"
                />
                <input
                  type="url"
                  value={newPostImageUrl}
                  onChange={(e) => setNewPostImageUrl(e.target.value)}
                  placeholder="Image URL (optional)"
                  className="w-full mt-2 text-sm placeholder-gray-400 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#800000]"
                />
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span><HiOutlinePhotograph className="w-4 h-4 text-emerald-600 inline" /> Image URLs only</span>
                    <Link to="/events" className="flex items-center gap-1.5 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                      <HiCalendar className="w-4 h-4 text-blue-600" />
                      <span>Events</span>
                    </Link>
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#800000] hover:bg-[#660000] text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all"
                  >
                    Post Update
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Campus Feed Posts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Campus Activity</h2>
              <span className="text-xs text-gray-500 font-medium">Latest Updates</span>
            </div>

            {loading ? (
              <p className="text-sm text-gray-400 text-center py-8">Loading campus activity...</p>
            ) : posts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8 bg-white rounded-2xl border border-gray-100">No posts yet. Share the first update.</p>
            ) : posts.map((post) => (
              <div id={`post-${post.id}`} key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
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
                {post.mediaUrl && (
                  <img src={post.mediaUrl} alt="Post attachment" loading="lazy" className="max-h-96 w-full rounded-xl object-cover" />
                )}

                <div className="flex items-center gap-6 pt-3 border-t border-gray-100 text-sm text-gray-500">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${post.hasLiked ? 'text-red-600 font-semibold' : 'hover:text-red-600'}`}
                  >
                    {post.hasLiked ? <HiHeart className="w-5 h-5 text-red-600" /> : <HiOutlineHeart className="w-5 h-5" />}
                    <span>{post.likes}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpandedComments((current) => current === post.id ? null : post.id)}
                    className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"
                  >
                    <HiOutlineChatAlt className="w-5 h-5" />
                    <span>{post.commentsCount}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 hover:text-gray-800 transition-colors ml-auto"
                  >
                    <HiOutlineShare className="w-5 h-5" />
                    <span>Share</span>
                  </button>
                </div>
                {expandedComments === post.id && (
                  <div className="space-y-3 border-t border-gray-100 pt-3">
                    {post.comments.map((comment) => (
                      <div key={comment.id} className="text-sm">
                        <span className="font-semibold text-gray-800">{comment.authorName}</span>
                        <span className="text-gray-600"> {comment.content}</span>
                      </div>
                    ))}
                    <form onSubmit={(e) => handleAddComment(e, post.id)} className="flex gap-2">
                      <input
                        value={commentDrafts[post.id] || ''}
                        onChange={(e) => setCommentDrafts((drafts) => ({ ...drafts, [post.id]: e.target.value }))}
                        maxLength={1000}
                        placeholder="Write a comment..."
                        className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                      <button type="submit" className="rounded-lg bg-[#800000] px-3 py-2 text-xs font-semibold text-white">Send</button>
                    </form>
                  </div>
                )}
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
                <span className="block text-lg font-bold text-gray-900">{suggestedStudents.length}</span>
                <span className="text-xs text-gray-400">Students</span>
              </Link>
              <Link to="/jobs" className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                <span className="block text-lg font-bold text-gray-900">{featuredJobs.length}</span>
                <span className="text-xs text-gray-400">Jobs</span>
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
              {suggestedStudents.slice(0, 3).map((student) => (
                <div key={student.id} className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <Link to={`/profile/${student.id}`} className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gray-200 font-bold text-gray-600 flex items-center justify-center text-xs flex-shrink-0">
                      {(student.name || 'S').charAt(0)}
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
              {featuredJobs.slice(0, 2).map((job) => (
                <div key={job.id} className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">Opportunity</span>
                  <p className="text-xs font-bold text-gray-800">{job.title}</p>
                  <p className="text-[11px] text-gray-500">{job.society} • {job.location}</p>
                </div>
              ))}
              {featuredJobs.length === 0 && <p className="text-xs text-gray-400">No job opportunities yet.</p>}
            </div>

            <Link
              to="/jobs"
              className="block text-center text-xs font-semibold text-[#800000] hover:underline pt-1"
            >
              Browse all student opportunities →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Home
