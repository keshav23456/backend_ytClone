import api from './api'

export const commentService = {
  getVideoComments: (videoId, params = {}) => {
    return api.get(`/comments/${videoId}`, { params })
  },

  addComment: (videoId, content) => {
    return api.post(`/comments/${videoId}`, { content })
  },

  updateComment: (commentId, content) => {
    return api.patch(`/comments/c/${commentId}`, { content })
  },

  deleteComment: (commentId) => {
    return api.delete(`/comments/c/${commentId}`)
  },

  likeComment: (commentId) => {
    return api.post(`/likes/toggle/c/${commentId}`)
  },
}