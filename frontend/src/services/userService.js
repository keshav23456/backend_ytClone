import api from './api'

export const userService = {
  getUserChannelProfile: (username) => {
    return api.get(`/users/c/${username}`)
  },

  getWatchHistory: () => {
    return api.get('/users/history')
  },

  updateAccountDetails: (data) => {
    return api.patch('/users/update-account', data)
  },

  updateAvatar: (formData) => {
    return api.patch('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  updateCoverImage: (formData) => {
    return api.patch('/users/cover-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },

  changePassword: (data) => {
    return api.post('/users/change-password', data)
  },
}