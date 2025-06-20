import api from './api'

export const videoService = {
  getAllVideos: (params = {}) => {
    return api.get('/videos', { params })
  },

  getVideoById: (videoId) => {
    return api.get(`/videos/${videoId}`)
  },

  uploadVideo: (formData) => {
    return api.post('/videos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateVideo: (videoId, data) => {
    return api.patch(`/videos/${videoId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  deleteVideo: (videoId) => {
    return api.delete(`/videos/${videoId}`)
  },

  togglePublishStatus: (videoId) => {
    return api.patch(`/videos/toggle/publish/${videoId}`)
  },

  likeVideo: (videoId) => {
    return api.post(`/likes/toggle/v/${videoId}`)
  },

  getLikedVideos: () => {
    return api.get('/likes/videos')
  },
}