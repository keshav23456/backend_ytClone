import React, { useState, useEffect } from 'react'
import VideoGrid from '../components/Video/VideoGrid'
import { videoService } from '../services/videoService'
import toast from 'react-hot-toast'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async (pageNum = 1) => {
    try {
      setLoading(pageNum === 1)
      const response = await videoService.getAllVideos({
        page: pageNum,
        limit: 12,
        sortBy: 'createdAt',
        sortType: 'desc'
      })
      
      const newVideos = response.data.data.docs || []
      
      if (pageNum === 1) {
        setVideos(newVideos)
      } else {
        setVideos(prev => [...prev, ...newVideos])
      }
      
      setHasMore(response.data.data.hasNextPage)
      setPage(pageNum)
    } catch (error) {
      toast.error('Failed to fetch videos')
      console.error('Error fetching videos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchVideos(page + 1)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trending Videos</h1>
        <p className="text-gray-600 mt-1">Discover the latest and most popular content</p>
      </div>

      <VideoGrid videos={videos} loading={loading && page === 1} />

      {hasMore && !loading && videos.length > 0 && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="btn-primary"
          >
            Load More Videos
          </button>
        </div>
      )}

      {loading && page > 1 && (
        <div className="text-center mt-8">
          <div className="loading-spinner mx-auto"></div>
        </div>
      )}
    </div>
  )
}

export default Home