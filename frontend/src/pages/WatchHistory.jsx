import React, { useState, useEffect } from 'react'
import VideoGrid from '../components/Video/VideoGrid'
import { userService } from '../services/userService'
import toast from 'react-hot-toast'

const WatchHistory = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWatchHistory()
  }, [])

  const fetchWatchHistory = async () => {
    try {
      const response = await userService.getWatchHistory()
      setVideos(response.data.data || [])
    } catch (error) {
      toast.error('Failed to fetch watch history')
      console.error('Error fetching watch history:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Watch History</h1>
        <p className="text-gray-600 mt-1">Videos you've watched recently</p>
      </div>

      <VideoGrid videos={videos} loading={loading} />
    </div>
  )
}

export default WatchHistory