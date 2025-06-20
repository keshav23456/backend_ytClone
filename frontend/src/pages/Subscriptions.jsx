import React, { useState, useEffect } from 'react'
import VideoGrid from '../components/Video/VideoGrid'
import { subscriptionService } from '../services/subscriptionService'
import { videoService } from '../services/videoService'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Subscriptions = () => {
  const { user } = useAuthStore()
  const [videos, setVideos] = useState([])
  const [channels, setChannels] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('videos')

  useEffect(() => {
    if (user) {
      fetchSubscribedChannels()
      fetchSubscriptionVideos()
    }
  }, [user])

  const fetchSubscribedChannels = async () => {
    try {
      const response = await subscriptionService.getSubscribedChannels(user._id)
      setChannels(response.data.data.docs || [])
    } catch (error) {
      console.error('Error fetching subscribed channels:', error)
    }
  }

  const fetchSubscriptionVideos = async () => {
    try {
      // This would need to be implemented in the backend to get videos from subscribed channels
      const response = await videoService.getAllVideos({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortType: 'desc'
      })
      setVideos(response.data.data.docs || [])
    } catch (error) {
      toast.error('Failed to fetch subscription videos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-600 mt-1">Latest videos from channels you follow</p>
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
            Latest Videos
          </button>
          <button
            onClick={() => setActiveTab('channels')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'channels'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Channels ({channels.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'videos' ? (
        <VideoGrid videos={videos} loading={loading} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {channels.map((subscription) => (
            <div key={subscription.channel._id} className="card p-6 text-center">
              <img
                src={subscription.channel.avatar}
                alt={subscription.channel.username}
                className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="font-medium text-gray-900 mb-1">
                {subscription.channel.fullName}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                @{subscription.channel.username}
              </p>
              <p className="text-sm text-gray-500">
                {subscription.channel.subscribersCount} subscribers
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Subscriptions