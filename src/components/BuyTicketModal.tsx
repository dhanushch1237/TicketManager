import { useState } from 'react'
import { Ticket } from '../types'
import { formatCurrency, formatDate } from '../lib/utils'
import { X, CreditCard, Calendar, MapPin, Users, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface BuyTicketModalProps {
  ticket: Ticket | null
  isOpen: boolean
  onClose: () => void
  onPurchase: (ticketId: string, quantity: number) => void
}

export default function BuyTicketModal({ ticket, isOpen, onClose, onPurchase }: BuyTicketModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  if (!ticket) return null

  const handlePurchase = async () => {
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      onPurchase(ticket.id, quantity)
      
      // Auto close after success animation
      setTimeout(() => {
        setSuccess(false)
        setQuantity(1)
        onClose()
      }, 2000)
    }, 1500)
  }

  const total = ticket.price * quantity

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {success ? (
              // Success State
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Check className="w-8 h-8 text-green-600" />
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Successful!</h3>
                <p className="text-gray-600 mb-4">
                  You've successfully purchased {quantity} ticket{quantity > 1 ? 's' : ''} for {ticket.title}
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    Total: <span className="font-semibold">{formatCurrency(total)}</span>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Confirmation details will be sent to your email
                  </p>
                </div>
              </div>
            ) : (
              // Purchase Form
              <>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold text-gray-900">Purchase Tickets</h2>
                  <button
                    onClick={onClose}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Ticket Info */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex space-x-4">
                    <img
                      src={ticket.image_url}
                      alt={ticket.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{ticket.title}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
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
                          <span>{ticket.available_quantity} available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchase Form */}
                <div className="p-6 space-y-6">
                  {/* Quantity Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(ticket.available_quantity, quantity + 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                        disabled={quantity >= ticket.available_quantity}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Price per ticket:</span>
                      <span>{formatCurrency(ticket.price)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Quantity:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <button
                    onClick={handlePurchase}
                    disabled={loading || quantity === 0}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Purchase Now</span>
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By purchasing, you agree to our terms and conditions
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}