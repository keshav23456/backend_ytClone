import React, { useState, useEffect } from 'react'
import VideoGrid from '../components/Video/VideoGrid'
import { videoService } from '../services/videoService'
import toast from 'react-hot-toast'

const LikedVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLikedVideos()
  }, [])

  const fetchLikedVideos = async () => {
    try {
      const response = await videoService.getLikedVideos()
      const likedVideos = response.data.data.map(item => item.likedVideo)
      setVideos(likedVideos)
    } catch (error) {
      toast.error('Failed to fetch liked videos')
      console.error('Error fetching liked videos:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Liked Videos</h1>
        <p className="text-gray-600 mt-1">Videos you've liked</p>
      </div>

      <VideoGrid videos={videos} loading={loading} />
    </div>
  )
}

export default LikedVideos