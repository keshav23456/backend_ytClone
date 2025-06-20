import api from './api'

export const dashboardService = {
  getChannelStats: () => {
    return api.get('/dashboard/stats')
  },

  getChannelVideos: (params = {}) => {
    return api.get('/dashboard/videos', { params })
  },
}