import { Ticket } from "../types";
import { formatCurrency, formatDate, cn } from "../lib/utils";
import { Calendar, MapPin, Users, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface TicketCardProps {
  ticket: Ticket;
  onBuy?: (ticket: Ticket) => void;
  className?: string;
}

const categoryColors = {
  cricket: "from-green-500 to-emerald-600",
  entertainment: "from-purple-500 to-pink-600",
  concert: "from-red-500 to-orange-600",
  sports: "from-blue-500 to-cyan-600",
  theater: "from-indigo-500 to-purple-600",
  comedy: "from-yellow-500 to-orange-500",
};

const typeIcons = {
  general: "🎫",
  vip: "⭐",
  premium: "💎",
  standard: "🎟️",
};

export default function TicketCard({
  ticket,
  onBuy,
  className,
}: TicketCardProps) {
  const isExpiringSoon =
    new Date(ticket.expiry_time) <
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const availabilityPercentage =
    (ticket.available_quantity /
      (ticket.available_quantity + ticket.sold_quantity)) *
    100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn("card p-6 group cursor-pointer", className)}
    >
      {/* Image */}
      <div className="relative mb-4 overflow-hidden rounded-xl">
        <img
          src={ticket.image_url}
          alt={ticket.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-white text-xs font-semibold bg-gradient-to-r ${
            categoryColors[ticket.category]
          }`}
        >
          {ticket.category.toUpperCase()}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium">
          {typeIcons[ticket.type]} {ticket.type.toUpperCase()}
        </div>
        {isExpiringSoon && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>Expiring Soon</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
            {ticket.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {ticket.description}
          </p>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{ticket.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(ticket.expiry_time)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{ticket.available_quantity} available</span>
          </div>
        </div>

        {/* Availability Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Availability</span>
            <span>{Math.round(availabilityPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                availabilityPercentage > 50
                  ? "bg-green-500"
                  : availabilityPercentage > 20
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${availabilityPercentage}%` }}
            />
          </div>
        </div>

        {/* Price and Action */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(ticket.price)}
            </div>
            <div className="text-xs text-gray-500">per ticket</div>
          </div>
          {onBuy && (
            <button
              onClick={() => onBuy(ticket)}
              className="btn-primary text-sm px-4 py-2"
              disabled={ticket.available_quantity === 0}
            >
              {ticket.available_quantity === 0 ? "Sold Out" : "Buy Now"}
            </button>
          )}
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
          <div className="w-6 h-6 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full flex items-center justify-center">
            <Star className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs text-gray-600">
            Sold by {ticket.seller_name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
