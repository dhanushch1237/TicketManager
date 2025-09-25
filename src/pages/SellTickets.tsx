import React, { useState } from 'react'
import { apiClient } from '../lib/api'
import { TicketCategory, TicketType } from '../types'
import { Upload, Calendar, MapPin, DollarSign, Tag, Users } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function SellTickets() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'cricket' as TicketCategory,
    type: 'general' as TicketType,
    price: '',
    expiry_time: '',
    location: '',
    available_quantity: '',
    image_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const categories: TicketCategory[] = ['cricket', 'entertainment', 'concert', 'sports', 'theater', 'comedy']
  const types: TicketType[] = ['general', 'vip', 'premium', 'standard']

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const ticketData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        type: formData.type,
        price: parseFloat(formData.price),
        expiry_time: formData.expiry_time,
        location: formData.location,
        available_quantity: parseInt(formData.available_quantity),
        image_url: formData.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'
      }

      await apiClient.createTicket(ticketData)
      setLoading(false)
      setSuccess(true)
      toast.success('Ticket listed successfully!')
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'cricket',
        type: 'general',
        price: '',
        expiry_time: '',
        location: '',
        available_quantity: '',
        image_url: ''
      })
    } catch (error) {
      setLoading(false)
      const message = error instanceof Error ? error.message : 'Failed to create ticket'
      setError(message)
      toast.error(message)
    }
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="card p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Listed Successfully!</h2>
          <p className="text-gray-600 mb-6">Your ticket has been added to the marketplace and is now available for purchase.</p>
          <div className="space-y-3">
            <button
              onClick={() => setSuccess(false)}
              className="btn-primary w-full"
            >
              List Another Ticket
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="btn-secondary w-full"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sell Your Tickets</h1>
        <p className="text-gray-600">List your tickets on the marketplace and reach thousands of buyers</p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="card p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., World Cup Cricket Final"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="Describe your tickets, seating details, and any special features..."
            />
          </div>

          {/* Category and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  id="category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field pl-10"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="input-field"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Price per Ticket ($) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="available_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Available Quantity *
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  id="available_quantity"
                  name="available_quantity"
                  required
                  min="1"
                  value={formData.available_quantity}
                  onChange={handleChange}
                  className="input-field pl-10"
                  placeholder="1"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Event Location *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="e.g., Madison Square Garden, New York"
              />
            </div>
          </div>

          {/* Expiry Time */}
          <div>
            <label htmlFor="expiry_time" className="block text-sm font-medium text-gray-700 mb-2">
              Event Date & Time *
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="datetime-local"
                id="expiry_time"
                name="expiry_time"
                required
                value={formData.expiry_time}
                onChange={handleChange}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-2">
              Event Image URL (Optional)
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="url"
                id="image_url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                className="input-field pl-10"
                placeholder="https://example.com/event-image.jpg"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Add an image URL to make your listing more attractive
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Listing Ticket...' : 'List Ticket for Sale'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}