import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'
import { formatCurrency, formatDate } from '../lib/utils'
import { Calendar, MapPin, Download, Star, Clock } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Purchases() {
  const [purchases, setPurchases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserPurchases()
  }, [])

  const loadUserPurchases = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getUserPurchases()
      setPurchases(response.purchases || [])
    } catch (error) {
      console.error('Error loading purchases:', error)
      toast.error('Failed to load your purchases')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDownloadTicket = async (_purchaseId: string) => {
    // TODO: Implement ticket download functionality
    toast('Download functionality coming soon!')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Purchases</h1>
        <p className="text-gray-600">View and manage your ticket purchases</p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(purchases.reduce((sum, p) => sum + (p.total_amount || 0), 0))}
              </p>
            </div>
            <div className="p-3 bg-primary-100 rounded-full">
              <Star className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tickets</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchases.reduce((sum, p) => sum + (p.quantity || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full">
              <Calendar className="w-6 h-6 text-secondary-600" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {purchases.filter(p => p.ticket && new Date(p.ticket.expiry_time) > new Date()).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Purchases List */}
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
          {purchases.map((purchase, index) => (
            <motion.div
              key={purchase.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="card p-6"
            >
              <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
                {/* Ticket Image */}
                <div className="flex-shrink-0">
                  <img
                    src={purchase.ticket?.image_url || 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={purchase.ticket?.title || 'Ticket'}
                    className="w-full lg:w-32 h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Ticket Details */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {purchase.ticket?.title || 'Unknown Event'}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {purchase.ticket?.description || 'No description available'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(purchase.status)}`}>
                      {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{purchase.ticket?.location || 'Location TBD'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{purchase.ticket?.expiry_time ? formatDate(purchase.ticket.expiry_time) : 'Date TBD'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="space-y-1">
                      <div className="text-sm text-gray-600">
                        Quantity: {purchase.quantity} × {formatCurrency(purchase.ticket?.price || 0)}
                      </div>
                      <div className="text-lg font-semibold text-gray-900">
                        Total: {formatCurrency(purchase.total_amount)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Purchased on {formatDate(purchase.purchase_date)}
                      </div>
                    </div>

                    {purchase.status === 'confirmed' && (
                      <button
                        onClick={() => handleDownloadTicket(purchase.id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && purchases.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No purchases yet</h3>
          <p className="text-gray-600 mb-4">Start browsing tickets to make your first purchase</p>
          <button
            onClick={() => window.location.href = '/tickets'}
            className="btn-primary"
          >
            Browse Tickets
          </button>
        </motion.div>
      )}
    </div>
  )
}