import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Play, Share2, MoreHorizontal } from 'lucide-react'
import { playlistService } from '../services/playlistService'
import { formatViews, formatDuration } from '../utils/formatters'
import { formatDistanceToNow } from 'date-fns'
import toast from 'react-hot-toast'

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (playlistId) {
      fetchPlaylist()
    }
  }, [playlistId])

  const fetchPlaylist = async () => {
    try {
      const response = await playlistService.getPlaylistById(playlistId)
      setPlaylist(response.data.data)
    } catch (error) {
      toast.error('Failed to fetch playlist')
      console.error('Error fetching playlist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4 w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded mb-6 w-1/2"></div>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex space-x-4">
                <div className="w-32 h-20 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!playlist) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Playlist not found</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Playlist Info */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
              <Play className="w-12 h-12 text-gray-400" />
            </div>
            
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              {playlist.name}
            </h1>
            
            <p className="text-gray-600 mb-4">
              {playlist.description}
            </p>
            
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>{playlist.totalVideos} videos</p>
              <p>{formatViews(playlist.totalViews)} total views</p>
              <p>Updated {formatDistanceToNow(new Date(playlist.updatedAt), { addSuffix: true })}</p>
            </div>
            
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={playlist.owner?.avatar}
                alt={playlist.owner?.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">
                  {playlist.owner?.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  @{playlist.owner?.username}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button className="btn-primary flex-1">
                <Play className="w-4 h-4 mr-2" />
                Play All
              </button>
              <button className="btn-secondary">
                <Share2 className="w-4 h-4" />
              </button>
              <button className="btn-secondary">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Videos List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {playlist.videos?.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No videos in this playlist</p>
              </div>
            ) : (
              playlist.videos?.map((video, index) => (
                <div key={video._id} className="flex space-x-4 p-4 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="flex-shrink-0 text-sm text-gray-500 w-6">
                    {index + 1}
                  </div>
                  
                  <div className="relative">
                    <img
                      src={video.thumbnail?.url || video.thumbnail}
                      alt={video.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-1">
                      {video.owner?.username}
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{formatViews(video.views)} views</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaylistDetail