import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, PlaySquare, Lock, Globe } from 'lucide-react'
import { playlistService } from '../services/playlistService'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Playlists = () => {
  const { user } = useAuthStore()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    if (user) {
      fetchPlaylists()
    }
  }, [user])

  const fetchPlaylists = async () => {
    try {
      const response = await playlistService.getUserPlaylists(user._id)
      setPlaylists(response.data.data.docs || [])
    } catch (error) {
      toast.error('Failed to fetch playlists')
      console.error('Error fetching playlists:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Playlists</h1>
          <p className="text-gray-600 mt-1">Organize your favorite videos</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Playlist
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-video bg-gray-300 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-12">
          <PlaySquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No playlists yet</h3>
          <p className="text-gray-600 mb-6">Create your first playlist to organize your videos</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlists.map((playlist) => (
            <Link
              key={playlist._id}
              to={`/playlist/${playlist._id}`}
              className="card hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-video bg-gray-200 rounded-t-lg flex items-center justify-center">
                <PlaySquare className="w-12 h-12 text-gray-400" />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{playlist.name}</h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {playlist.description}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{playlist.totalVideos} videos</span>
                  <span>{playlist.totalViews} views</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Playlists