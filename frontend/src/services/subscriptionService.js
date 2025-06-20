import api from './api'

export const subscriptionService = {
  toggleSubscription: (channelId) => {
    return api.post(`/subscriptions/c/${channelId}`)
  },

  getSubscribedChannels: (subscriberId, params = {}) => {
    return api.get(`/subscriptions/u/${subscriberId}`, { params })
  },

  getChannelSubscribers: (channelId, params = {}) => {
    return api.get(`/subscriptions/c/${channelId}`, { params })
  },
}