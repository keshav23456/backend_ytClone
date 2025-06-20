import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Compass, 
  Users, 
  Heart, 
  Clock, 
  PlaySquare, 
  Upload,
  BarChart3,
  X
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { isAuthenticated } = useAuthStore()

  const menuItems = [
    { icon: Home, label: 'Home', path: '/', public: true },
    { icon: Compass, label: 'Explore', path: '/explore', public: true },
  ]

  const authenticatedItems = [
    { icon: Users, label: 'Subscriptions', path: '/subscriptions' },
    { icon: Heart, label: 'Liked Videos', path: '/liked-videos' },
    { icon: Clock, label: 'Watch History', path: '/history' },
    { icon: PlaySquare, label: 'Playlists', path: '/playlists' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <div className="p-4">
          {/* Mobile close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <nav className="space-y-2">
            {/* Public menu items */}
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}

            {/* Authenticated menu items */}
            {isAuthenticated && (
              <>
                <hr className="my-4" />
                {authenticatedItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </>
            )}

            {/* Login prompt for unauthenticated users */}
            {!isAuthenticated && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-3">
                  Sign in to like videos, comment, and subscribe.
                </p>
                <Link
                  to="/login"
                  onClick={onClose}
                  className="btn-primary w-full text-center block"
                >
                  Sign In
                </Link>
              </div>
            )}
          </nav>
        </div>
      </aside>
    </>
  )
}

export default Sidebar