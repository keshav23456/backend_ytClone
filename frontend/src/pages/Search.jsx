import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import VideoGrid from '../components/Video/VideoGrid'
import { videoService } from '../services/videoService'
import toast from 'react-hot-toast'

const Search = () => {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (query) {
      searchVideos()
    }
  }, [query])

  const searchVideos = async () => {
    try {
      setLoading(true)
      const response = await videoService.getAllVideos({
        query,
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        sortType: 'desc'
      })
      
      setVideos(response.data.data.docs || [])
    } catch (error) {
      toast.error('Failed to search videos')
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600 mt-1">
          {loading ? 'Searching...' : `${videos.length} results found`}
        </p>
      </div>

      <VideoGrid videos={videos} loading={loading} />
    </div>
  )
}

export default Search