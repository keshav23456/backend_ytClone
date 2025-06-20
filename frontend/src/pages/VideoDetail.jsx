import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ReactPlayer from 'react-player'
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal } from 'lucide-react'
import { videoService } from '../services/videoService'
import { commentService } from '../services/commentService'
import { subscriptionService } from '../services/subscriptionService'
import { formatViews, formatSubscribers } from '../utils/formatters'
import { formatDistanceToNow } from 'date-fns'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const VideoDetail = () => {
  const { videoId } = useParams()
  const { user, isAuthenticated } = useAuthStore()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)

  useEffect(() => {
    if (videoId) {
      fetchVideo()
      fetchComments()
    }
  }, [videoId])

  const fetchVideo = async () => {
    try {
      const response = await videoService.getVideoById(videoId)
      setVideo(response.data.data)
    } catch (error) {
      toast.error('Failed to load video')
      console.error('Error fetching video:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await commentService.getVideoComments(videoId)
      setComments(response.data.data.docs || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    }
  }

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to like videos')
      return
    }

    try {
      await videoService.likeVideo(videoId)
      fetchVideo() // Refresh video data to get updated like status
    } catch (error) {
      toast.error('Failed to like video')
    }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe')
      return
    }

    try {
      await subscriptionService.toggleSubscription(video.owner._id)
      fetchVideo() // Refresh video data to get updated subscription status
    } catch (error) {
      toast.error('Failed to update subscription')
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to comment')
      return
    }

    if (!commentText.trim()) return

    setSubmittingComment(true)
    try {
      await commentService.addComment(videoId, commentText.trim())
      setCommentText('')
      fetchComments()
      toast.success('Comment added successfully')
    } catch (error) {
      toast.error('Failed to add comment')
    } finally {
      setSubmittingComment(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="aspect-video bg-gray-300 rounded-lg mb-4"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        </div>
      </div>
    )
  }

  if (!video) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Video not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video section */}
        <div className="lg:col-span-2">
          {/* Video player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
            <ReactPlayer
              url={video.videoFile?.url || video.videoFile}
              width="100%"
              height="100%"
              controls
              playing
            />
          </div>

          {/* Video info */}
          <div className="space-y-4">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
              {video.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>{formatViews(video.views)} views</span>
                <span>•</span>
                <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    video.isLiked 
                      ? 'bg-primary-100 text-primary-700' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>{video.likesCount || 0}</span>
                </button>

                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Channel info */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  src={video.owner?.avatar?.url || video.owner?.avatar}
                  alt={video.owner?.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium text-gray-900">
                    {video.owner?.username}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatSubscribers(video.owner?.subscribersCount)}
                  </p>
                </div>
              </div>

              {isAuthenticated && user?._id !== video.owner?._id && (
                <button
                  onClick={handleSubscribe}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    video.owner?.isSubscribed
                      ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                  }`}
                >
                  {video.owner?.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>

            {/* Description */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {video.description}
              </p>
            </div>

            {/* Comments section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Comments ({comments.length})
              </h3>

              {/* Add comment form */}
              {isAuthenticated && (
                <form onSubmit={handleCommentSubmit} className="space-y-3">
                  <div className="flex space-x-3">
                    <img
                      src={user?.avatar}
                      alt={user?.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setCommentText('')}
                      className="btn-ghost"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!commentText.trim() || submittingComment}
                      className="btn-primary"
                    >
                      {submittingComment ? 'Posting...' : 'Comment'}
                    </button>
                  </div>
                </form>
              )}

              {/* Comments list */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment._id} className="flex space-x-3">
                    <img
                      src={comment.owner?.avatar}
                      alt={comment.owner?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">
                          {comment.owner?.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{comment.likesCount || 0}</span>
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-900">
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with related videos */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Related Videos</h3>
          {/* Add related videos component here */}
        </div>
      </div>
    </div>
  )
}

export default VideoDetail