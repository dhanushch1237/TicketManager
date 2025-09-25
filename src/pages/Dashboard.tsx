import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import { apiClient } from '../lib/api'
import { formatCurrency } from '../lib/utils'
import { Ticket } from '../types'
import TicketCard from '../components/TicketCard'
import BuyTicketModal from '../components/BuyTicketModal'
import { 
  TrendingUp, 
  Ticket as TicketIcon, 
  DollarSign, 
  Users,
  Calendar,
  Star,
  ArrowRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [featuredTickets, setFeaturedTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [showBuyModal, setShowBuyModal] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load user stats and featured tickets in parallel
      const [userStatsResponse, ticketsResponse] = await Promise.all([
        apiClient.getUserStats(),
        apiClient.getTickets({ limit: 3 })
      ])
      
      setStats(userStatsResponse.stats)
      setFeaturedTickets(ticketsResponse.tickets)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const statsCards = stats ? [
    {
      name: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue || 0),
      change: '+12%',
      changeType: 'positive' as const,
      icon: DollarSign
    },
    {
      name: 'Tickets Sold',
      value: (stats.totalTicketsSold || 0).toString(),
      change: '+8%',
      changeType: 'positive' as const,
      icon: TicketIcon
    },
    {
      name: 'Active Tickets',
      value: (stats.activeTickets || 0).toString(),
      change: '-2%',
      changeType: 'negative' as const,
      icon: TrendingUp
    },
    {
      name: 'Total Views',
      value: (stats.totalViews || 0).toString(),
      change: '+15%',
      changeType: 'positive' as const,
      icon: Users
    }
  ] : []

  const handleBuyTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setShowBuyModal(true)
  }

  const handlePurchase = async (ticketId: string, quantity: number) => {
    try {
      await apiClient.createPurchase(ticketId, quantity)
      toast.success(`Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}!`)
      // Reload dashboard data to update stats
      loadDashboardData()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Purchase failed'
      toast.error(message)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your tickets today.
        </p>
      </motion.div>

      {/* Stats Grid */}
      {statsCards.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.name} className="card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">from last month</span>
                </div>
              </div>
            )
          })}
        </motion.div>
      )}

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <Link to="/sell" className="card p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-full group-hover:bg-primary-200 transition-colors">
              <TicketIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Sell Tickets</h3>
              <p className="text-sm text-gray-600">List your tickets for sale</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors ml-auto" />
          </div>
        </Link>

        <Link to="/tickets" className="card p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary-100 rounded-full group-hover:bg-secondary-200 transition-colors">
              <Star className="w-6 h-6 text-secondary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Browse Tickets</h3>
              <p className="text-sm text-gray-600">Find tickets to buy</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-secondary-600 transition-colors ml-auto" />
          </div>
        </Link>

        <Link to="/purchases" className="card p-6 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">My Purchases</h3>
              <p className="text-sm text-gray-600">View your tickets</p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition-colors ml-auto" />
          </div>
        </Link>
      </motion.div>

      {/* Recent Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Tickets</h2>
          <Link 
            to="/tickets" 
            className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <TicketCard ticket={ticket} onBuy={handleBuyTicket} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Sold 2 tickets', event: 'World Cup Cricket Final', time: '2 hours ago', type: 'sale' },
            { action: 'Listed new tickets', event: 'Taylor Swift Concert', time: '1 day ago', type: 'listing' },
            { action: 'Purchased tickets', event: 'NBA Finals', time: '3 days ago', type: 'purchase' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                activity.type === 'sale' ? 'bg-green-500' :
                activity.type === 'listing' ? 'bg-blue-500' : 'bg-purple-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.event}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

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