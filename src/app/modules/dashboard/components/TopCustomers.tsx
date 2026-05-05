import React from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "@app/components/ui/card";
import { useTrans } from "@app/hooks/useTranslation";
import type { TopCustomerData } from "../types";

interface TopCustomersProps {
  customers: TopCustomerData[];
  loading?: boolean;
  onViewDetails?: () => void;
}

const TopCustomers: React.FC<TopCustomersProps> = ({ customers }) => {
  const { t } = useTrans();
  const navigate = useNavigate();

  const handleCustomerClick = (customerId: number) => {
    navigate(`/customers/${customerId}`);
  };

  const getRankBgColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";
      case 1:
        return "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400";
      case 2:
        return "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400";
      default:
        return "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400";
    }
  };

  return (
    <Card variant="default" padding="none" className="h-full flex flex-col">
      <div className="flex flex-col h-full max-h-[492px]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("dashboardTopCustomersTitle")}
            </h3>
            <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              {t("dashboardTopCustomersSortBy")}
            </button>
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {customers.length === 0 ? (
            <div className="flex items-center justify-center h-full px-6 py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400 dark:text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("dashboardTopCustomersEmpty")}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {customers.map((customer, index) => (
                <div
                  key={customer.customerId}
                  onClick={() => handleCustomerClick(customer.customerId)}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 font-semibold ${getRankBgColor(index)}`}
                    >
                      {index + 1}
                    </div>

                    {/* Customer Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-3 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {customer.customerName}
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {customer.customerType}
                      </p>
                    </div>

                    {/* Ticket Count */}
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {customer.count}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {t("dashboardTopCustomersTickets")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TopCustomers;
