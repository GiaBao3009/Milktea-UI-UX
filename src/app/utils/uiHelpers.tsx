import { Info, CheckCircle, Clock } from 'lucide-react';

/**
 * Get icon component based on notification type
 */
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "create":
      return <Info size={14} className="text-blue-500" />;
    case "status":
      return <CheckCircle size={14} className="text-green-500" />;
    case "comment":
      return <Clock size={14} className="text-brand-500" />;
    default:
      return <Info size={14} className="text-slate-400" />;
  }
};

/**
 * Get user initials from full name or email
 */
export const getUserInitials = (name: string): string => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
