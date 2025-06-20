import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BarChart3, 
  Eye, 
  Heart, 
  Users, 
  Video, 
  Plus,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-react'
import { dashboardService } from '../services/dashboardService'
import { videoService } from '../services/videoService'
import { formatViews, formatDuration } from '../utils/formatters'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [videosLoading, setVideosLoading] = useState(true)

  useEffect(() => {
    fetchStats()
    fetchVideos()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getChannelStats()
      setStats(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch channel stats')
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchVideos = async () => {
    try {
      const response = await dashboardService.getChannelVideos({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortType: 'desc'
      })
      setVideos(response.data.data.docs || [])
    } catch (error) {
      toast.error('Failed to fetch videos')
      console.error('Error fetching videos:', error)
    } finally {
      setVideosLoading(false)
    }
  }

  const handleDeleteVideo = async (videoId) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      await videoService.deleteVideo(videoId)
      toast.success('Video deleted successfully')
      fetchVideos()
      fetchStats()
    } catch (error) {
      toast.error('Failed to delete video')
    }
  }

  const handleTogglePublish = async (videoId) => {
    try {
      await videoService.togglePublishStatus(videoId)
      toast.success('Video status updated')
      fetchVideos()
    } catch (error) {
      toast.error('Failed to update video status')
    }
  }

  const statCards = [
    {
      title: 'Total Views',
      value: stats?.totalViews || 0,
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      formatter: formatViews
    },
    {
      title: 'Subscribers',
      value: stats?.totalSubscribers || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      formatter: (val) => val.toLocaleString()
    },
    {
      title: 'Total Likes',
      value: stats?.totalLikes || 0,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      formatter: (val) => val.toLocaleString()
    },
    {
      title: 'Videos',
      value: stats?.totalVideos || 0,
      icon: Video,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      formatter: (val) => val.toLocaleString()
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your channel and content</p>
        </div>
        <Link to="/upload" className="btn-primary mt-4 sm:mt-0">
          <Plus className="w-4 h-4 mr-2" />
          Upload Video
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stat.formatter(stat.value)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Videos Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Your Videos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Video
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Likes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {videosLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-12 bg-gray-300 rounded"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-300 rounded w-48"></div>
                          <div className="h-3 bg-gray-300 rounded w-24"></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-12"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-20"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-300 rounded w-8"></div>
                    </td>
                  </tr>
                ))
              ) : videos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <Video className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium">No videos uploaded yet</p>
                      <p className="text-sm mt-1">Start creating content to see your videos here</p>
                      <Link to="/upload" className="btn-primary mt-4 inline-flex items-center">
                        <Plus className="w-4 h-4 mr-2" />
                        Upload Your First Video
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                videos.map((video) => (
                  <tr key={video._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={video.thumbnail?.url || video.thumbnail}
                          alt={video.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                        <div>
                          <Link
                            to={`/video/${video._id}`}
                            className="font-medium text-gray-900 hover:text-primary-600"
                          >
                            {video.title}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {formatDuration(video.duration)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          video.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {video.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatViews(video.views)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {video.likesCount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleTogglePublish(video._id)}
                          className="text-sm text-blue-600 hover:text-blue-900"
                        >
                          {video.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(video._id)}
                          className="text-sm text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard