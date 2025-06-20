import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Upload as UploadIcon, X, Play } from 'lucide-react'
import { videoService } from '../services/videoService'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Upload = () => {
  const [videoFile, setVideoFile] = useState(null)
  const [thumbnail, setThumbnail] = useState(null)
  const [videoPreview, setVideoPreview] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setVideoFile(file)
      const url = URL.createObjectURL(file)
      setVideoPreview(url)
    }
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setThumbnailPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeVideo = () => {
    setVideoFile(null)
    setVideoPreview(null)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }
  }

  const removeThumbnail = () => {
    setThumbnail(null)
    setThumbnailPreview(null)
  }

  const onSubmit = async (data) => {
    if (!videoFile || !thumbnail) {
      toast.error('Please select both video and thumbnail files')
      return
    }

    setUploading(true)
    
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('description', data.description)
    formData.append('videoFile', videoFile)
    formData.append('thumbnail', thumbnail)

    try {
      const response = await videoService.uploadVideo(formData)
      toast.success('Video uploaded successfully!')
      reset()
      removeVideo()
      removeThumbnail()
      navigate('/dashboard')
    } catch (error) {
      toast.error('Failed to upload video')
      console.error('Upload error:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
        <p className="text-gray-600 mt-1">Share your content with the world</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Video Upload */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Video File</h2>
          
          {!videoFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                className="hidden"
                id="video-upload"
              />
              <label
                htmlFor="video-upload"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                <UploadIcon className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Click to upload video
                  </p>
                  <p className="text-sm text-gray-500">
                    MP4, WebM, or OGV (max 100MB)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative">
              <video
                src={videoPreview}
                controls
                className="w-full max-h-96 rounded-lg"
              />
              <button
                type="button"
                onClick={removeVideo}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="mt-2 text-sm text-gray-600">
                {videoFile.name} ({(videoFile.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            </div>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Thumbnail</h2>
          
          {!thumbnail ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="hidden"
                id="thumbnail-upload"
              />
              <label
                htmlFor="thumbnail-upload"
                className="cursor-pointer flex flex-col items-center space-y-4"
              >
                <UploadIcon className="w-12 h-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Click to upload thumbnail
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG, or GIF (recommended: 1280x720)
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative inline-block">
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="max-w-xs rounded-lg"
              />
              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Video Details */}
        <div className="card p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Video Details</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 100, message: 'Title must be less than 100 characters' }
                })}
                type="text"
                className="input-field"
                placeholder="Enter video title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                {...register('description', { 
                  required: 'Description is required',
                  maxLength: { value: 5000, message: 'Description must be less than 5000 characters' }
                })}
                rows="6"
                className="input-field resize-none"
                placeholder="Tell viewers about your video"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading || !videoFile || !thumbnail}
            className="btn-primary flex items-center space-x-2"
          >
            {uploading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadIcon className="w-4 h-4" />
                <span>Upload Video</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Upload