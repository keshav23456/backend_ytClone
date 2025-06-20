import React from 'react'
import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { formatDuration, formatViews } from '../../utils/formatters'

const VideoCard = ({ video, showChannel = true }) => {
  return (
    <div className="video-card group">
      <Link to={`/video/${video._id}`}>
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <img
            src={video.thumbnail?.url || video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(video.duration)}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <div className="flex space-x-3">
          {showChannel && video.ownerDetails && (
            <Link to={`/channel/${video.ownerDetails.username}`}>
              <img
                src={video.ownerDetails.avatar?.url || video.ownerDetails.avatar}
                alt={video.ownerDetails.username}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            </Link>
          )}
          
          <div className="flex-1 min-w-0">
            <Link to={`/video/${video._id}`}>
              <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {video.title}
              </h3>
            </Link>
            
            {showChannel && video.ownerDetails && (
              <Link 
                to={`/channel/${video.ownerDetails.username}`}
                className="text-sm text-gray-600 hover:text-gray-900 mt-1 block"
              >
                {video.ownerDetails.username}
              </Link>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard