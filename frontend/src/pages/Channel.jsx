import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, MapPin, Link as LinkIcon } from 'lucide-react'
import VideoGrid from '../components/Video/VideoGrid'
import { userService } from '../services/userService'
import { videoService } from '../services/videoService'
import { subscriptionService } from '../services/subscriptionService'
import { formatSubscribers } from '../utils/formatters'
import { formatDistanceToNow } from 'date-fns'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Channel = () => {
  const { username } = useParams()
  const { user, isAuthenticated } = useAuthStore()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('videos')

  useEffect(() => {
    if (username) {
      fetchChannel()
      fetchChannelVideos()
    }
  }, [username])

  const fetchChannel = async () => {
    try {
      const response = await userService.getUserChannelProfile(username)
      setChannel(response.data.data)
    } catch (error) {
      toast.error('Channel not found')
      console.error('Error fetching channel:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchChannelVideos = async () => {
    try {
      const response = await videoService.getAllVideos({
        userId: channel?._id,
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortType: 'desc'
      })
      setVideos(response.data.data.docs || [])
    } catch (error) {
      console.error('Error fetching channel videos:', error)
    } finally {
      setVideosLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to subscribe')
      return
    }

    try {
      await subscriptionService.toggleSubscription(channel._id)
      fetchChannel() // Refresh channel data
      toast.success(channel.isSubscribed ? 'Unsubscribed' : 'Subscribed')
    } catch (error) {
      toast.error('Failed to update subscription')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-300 rounded-lg mb-6"></div>
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-24 h-24 bg-gray-300 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-300 rounded w-48"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!channel) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Channel not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cover Image */}
      {channel.coverImage && (
        <div className="h-48 lg:h-64 mb-6 rounded-lg overflow-hidden">
          <img
            src={channel.coverImage}
            alt={`${channel.fullName} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Channel Info */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div className="flex items-center space-x-6 mb-4 lg:mb-0">
          <img
            src={channel.avatar}
            alt={channel.fullName}
            className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
              {channel.fullName}
            </h1>
            <p className="text-gray-600 mb-2">@{channel.username}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{formatSubscribers(channel.subscribersCount)}</span>
              <span>•</span>
              <span>{channel.channelsSubscribedToCount} subscriptions</span>
            </div>
          </div>
        </div>

        {isAuthenticated && user?._id !== channel._id && (
          <button
            onClick={handleSubscribe}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              channel.isSubscribed
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('videos')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'videos'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Videos
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'about'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            About
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'videos' ? (
        <VideoGrid videos={videos} loading={videosLoading} showChannel={false} />
      ) : (
        <div className="max-w-4xl">
          <div className="card p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">About</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>
                  Joined {formatDistanceToNow(new Date(channel.createdAt), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <span className="font-medium">Email:</span>
                <span>{channel.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Channel