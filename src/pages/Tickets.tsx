import { useState } from 'react'
import { useEffect } from 'react'
import { apiClient } from '../lib/api'
import TicketCard from '../components/TicketCard'
import BuyTicketModal from '../components/BuyTicketModal'
import { Ticket, TicketCategory, TicketType } from '../types'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function Tickets() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TicketCategory | 'all'>('all')
  const [selectedType, setSelectedType] = useState<TicketType | 'all'>('all')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadTickets()
  }, [searchTerm, selectedCategory, selectedType, priceRange])

  const loadTickets = async () => {
    try {
      setLoading(true)
      const filters = {
        search: searchTerm,
        category: selectedCategory,
        type: selectedType,
        minPrice: priceRange[0],
        maxPrice: priceRange[1]
      }
      const result = await apiClient.getTickets(filters)
      setTickets(result.tickets)
    } catch (error) {
      console.error('Error loading tickets:', error)
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const categories: (TicketCategory | 'all')[] = ['all', 'cricket', 'entertainment', 'concert', 'sports', 'theater', 'comedy']
  const types: (TicketType | 'all')[] = ['all', 'general', 'vip', 'premium', 'standard']

  const handleBuyTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowBuyModal(true)
  }

  const handlePurchase = async (ticketId: string, quantity: number) => {
    try {
      await apiClient.createPurchase(ticketId, quantity)
      toast.success(`Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}!`)
      // Reload tickets to update availability
      loadTickets()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Purchase failed'
      toast.error(message)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Tickets</h1>
        <p className="text-gray-600">Discover amazing events and secure your tickets</p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 space-y-4"
      >
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search tickets, events, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <div className="text-sm text-gray-600">
            {tickets.length} tickets found
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card p-6 space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as TicketCategory | 'all')}
                  className="input-field"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as TicketType | 'all')}
                  className="input-field"
                >
                  {types.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <TicketCard ticket={ticket} onBuy={handleBuyTicket} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {!loading && tickets.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('all')
              setSelectedType('all')
              setPriceRange([0, 1000])
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* Buy Ticket Modal */}
      <BuyTicketModal
        ticket={selectedTicket}
        isOpen={showBuyModal}
        onClose={() => {
          setShowBuyModal(false)
          setSelectedTicket(null)
        }}
        onPurchase={handlePurchase}
      />
    </div>
  )
}