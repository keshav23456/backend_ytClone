import api from './api'

export const playlistService = {
  createPlaylist: (data) => {
    return api.post('/playlist', data)
  },

  getUserPlaylists: (userId, params = {}) => {
    return api.get(`/playlist/user/${userId}`, { params })
  },

  getPlaylistById: (playlistId) => {
    return api.get(`/playlist/${playlistId}`)
  },

  updatePlaylist: (playlistId, data) => {
    return api.patch(`/playlist/${playlistId}`, data)
  },

  deletePlaylist: (playlistId) => {
    return api.delete(`/playlist/${playlistId}`)
  },

  addVideoToPlaylist: (videoId, playlistId) => {
    return api.patch(`/playlist/add/${videoId}/${playlistId}`)
  },

  removeVideoFromPlaylist: (videoId, playlistId) => {
    return api.patch(`/playlist/remove/${videoId}/${playlistId}`)
  },
}