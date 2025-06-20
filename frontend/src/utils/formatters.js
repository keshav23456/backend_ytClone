export const formatDuration = (seconds) => {
  if (!seconds) return '0:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

export const formatViews = (views) => {
  if (!views) return '0'
  
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M`
  }
  
  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K`
  }
  
  return views.toString()
}

export const formatSubscribers = (count) => {
  if (!count) return '0 subscribers'
  
  if (count === 1) return '1 subscriber'
  
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M subscribers`
  }
  
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K subscribers`
  }
  
  return `${count} subscribers`
}

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}