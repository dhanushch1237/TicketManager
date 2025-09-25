import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'
import { Ticket } from '../types'
import { formatCurrency, formatDate } from '../lib/utils'
import { Calendar, MapPin, Users, Edit, Trash2, Eye, EyeOff, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function MyListings() {
  const [listings, setListings] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserTickets()
  }, [])

  const loadUserTickets = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getUserTickets()
      setListings(response.tickets || [])
    } catch (error) {
      console.error('Error loading user tickets:', error)
      toast.error('Failed to load your tickets')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'sold_out':
        return 'bg-blue-100 text-blue-800'
      case 'paused':
        return 'bg-yellow-100 text-yellow-800'
      case 'expired':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Eye className="w-4 h-4" />
      case 'sold_out':
        return <Users className="w-4 h-4" />
      case 'paused':
        return <EyeOff className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  const handleEditListing = async (_listingId: string) => {
    // TODO: Implement edit functionality
    toast('Edit functionality coming soon!')
  }

  const handleDeleteListing = async (listingId: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      try {
        await apiClient.deleteTicket(listingId)
        toast.success('Ticket deleted successfully!')
        loadUserTickets() // Reload the list
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to delete ticket'
        toast.error(message)
      }
    }
  }

  const handleToggleStatus = async (listingId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active'
    try {
      await apiClient.updateTicket(listingId, { status: newStatus })
      toast.success(`Ticket ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`)
      loadUserTickets() // Reload the list
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update ticket status'
      toast.error(message)
    }
  }

  const totalRevenue = listings.reduce((sum, listing) => 
    sum + (listing.price * listing.sold_quantity), 0
  )

  const totalViews = listings.reduce((sum, listing) => sum + (listing.views || 0), 0)
  const totalInquiries = listings.reduce((sum, listing) => sum + (listing.inquiries || 0), 0)

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
        <p className="text-gray-600">Manage your tickets and track their performance</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900">
                {listings.filter(l => l.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Eye className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full">
              <Users className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Inquiries</p>
              <p className="text-2xl font-bold text-gray-900">{totalInquiries}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Listings */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {listings.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="card p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Ticket Image */}
                <div className="flex-shrink-0">
                  <img
                    src={ticket.image_url}
                    alt={ticket.title}
                    className="w-full lg:w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Ticket Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {ticket.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(ticket.status)}`}>
                        {getStatusIcon(ticket.status)}
                        <span>{ticket.status.replace('_', ' ').toUpperCase()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{ticket.location}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(ticket.expiry_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>{ticket.available_quantity} available, {ticket.sold_quantity} sold</span>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{formatCurrency(ticket.price)}</div>
                      <div className="text-xs text-gray-500">Price per ticket</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{ticket.views || 0}</div>
                      <div className="text-xs text-gray-500">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{ticket.inquiries || 0}</div>
                      <div className="text-xs text-gray-500">Inquiries</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="text-sm text-gray-600">
                      Revenue: <span className="font-semibold text-gray-900">
                        {formatCurrency(ticket.price * ticket.sold_quantity)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleStatus(ticket.id, ticket.status)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          ticket.status === 'active'
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                      >
                        {ticket.status === 'active' ? 'Pause' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleEditListing(ticket.id)}
                        className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteListing(ticket.id)}
                        className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && listings.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
          <p className="text-gray-600 mb-4">Start selling your tickets to see them here</p>
          <button
            onClick={() => window.location.href = '/sell'}
            className="btn-primary"
          >
            Create Your First Ticket
          </button>
        </motion.div>
      )}
    </div>
  )
}