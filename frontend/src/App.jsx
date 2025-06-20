import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import VideoDetail from './pages/VideoDetail'
import Channel from './pages/Channel'
import Upload from './pages/Upload'
import Dashboard from './pages/Dashboard'
import Subscriptions from './pages/Subscriptions'
import LikedVideos from './pages/LikedVideos'
import WatchHistory from './pages/WatchHistory'
import Playlists from './pages/Playlists'
import PlaylistDetail from './pages/PlaylistDetail'
import Search from './pages/Search'
import Profile from './pages/Profile'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

function App() {
  const { checkAuth, isLoading } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="video/:videoId" element={<VideoDetail />} />
        <Route path="channel/:username" element={<Channel />} />
        
        <Route path="subscriptions" element={
          <ProtectedRoute>
            <Subscriptions />
          </ProtectedRoute>
        } />
        
        <Route path="liked-videos" element={
          <ProtectedRoute>
            <LikedVideos />
          </ProtectedRoute>
        } />
        
        <Route path="history" element={
          <ProtectedRoute>
            <WatchHistory />
          </ProtectedRoute>
        } />
        
        <Route path="playlists" element={
          <ProtectedRoute>
            <Playlists />
          </ProtectedRoute>
        } />
        
        <Route path="playlist/:playlistId" element={<PlaylistDetail />} />
        
        <Route path="upload" element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        } />
        
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default App