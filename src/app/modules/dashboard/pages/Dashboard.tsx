import React, { useEffect, useState } from "react";
import DashboardCard from "../components/DashboardCard";
import DashboardChart from "../components/DashboardChart";
import TopCustomers from "../components/TopCustomers";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { AlertCircle } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { Button } from "@app/components/ui/button";
import { dateRangeText } from "../utils/helper.utils";

const Dashboard = () => {
  const {
    cards,
    chartData,
    topCustomers,
    loading,
    error,
    chartLoading,
    chartError,
    topCustomersLoading,
    topCustomersError,
    fetchDashboardStats,
    fetchWarrantyTrend,
    fetchReportByProduct,
    updateFilters,
  } = useDashboard();

  const [selectedRange, setSelectedRange] = useState<"day" | "week" | "month">(
    "week",
  );

  const isLoading = loading || chartLoading || topCustomersLoading;
  const hasError = error || chartError || topCustomersError;
  const errorMessage = error || chartError || topCustomersError;

  useEffect(() => {
    fetchDashboardStats({
      from_date: "",
      to_date: "",
      product_id: undefined,
      batch_id: undefined,
    });
    fetchWarrantyTrend({
      from_date: "",
      to_date: "",
      product_id: 0,
      batch_id: 0,
      unit: "day",
    });
    fetchReportByProduct({
      from_date: "",
      to_date: "",
      product_id: undefined,
      batch_id: undefined,
    });
  }, []);

  const handleRangeChange = (range: "day" | "week" | "month") => {
    setSelectedRange(range);
    // updateFilters({ range });
  };

  const handleRetry = () => {
    fetchDashboardStats({
      from_date: "",
      to_date: "",
      product_id: undefined,
      batch_id: undefined,
    });
    fetchWarrantyTrend({
      from_date: "",
      to_date: "",
      product_id: 0,
      batch_id: 0,
      unit: "day",
    });
    fetchReportByProduct({
      from_date: "",
      to_date: "",
      product_id: undefined,
      batch_id: undefined,
    });
  };

  const displayCards = cards.slice(0, 4);

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Quản Lý
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Theo dõi dữ liệu hệ thống thời gian thực
              </p>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                •
              </span>
              <p className="text-sm font-medium text-brand-600 dark:text-brand-400">
                {dateRangeText(selectedRange)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <Button
              onClick={() => handleRangeChange("day")}
              variant="ghost"
              className={`px-6 py-2.5 font-medium text-sm transition-all dark:text-white rounded-lg ${selectedRange === "day"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              Hôm nay
            </Button>
            <Button
              onClick={() => handleRangeChange("week")}
              variant="ghost"
              className={`px-6 py-2.5 font-medium text-sm transition-all dark:text-white rounded-lg ${selectedRange === "week"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              Tuần này
            </Button>
            <Button
              onClick={() => handleRangeChange("month")}
              variant="ghost"
              className={`px-6 py-2.5 font-medium text-sm transition-all dark:text-white rounded-lg ${selectedRange === "month"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
            >
              Tháng này
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {hasError && !isLoading && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  Lỗi tải dữ liệu
                </p>
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {errorMessage}
                </p>
              </div>
              <Button
                onClick={handleRetry}
                variant="ghost"
                className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
              >
                Thử lại
              </Button>
            </div>
          </div>
        )}

        {isLoading ? (
          <DashboardSkeleton />
        ) : (
          <>
            {/* Dashboard Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {displayCards.length > 0 ? (
                displayCards.map((card: any, index: number) => (
                  <DashboardCard
                    key={`${card.name}-${index}`}
                    name={card.name}
                    color={card.color}
                    value={card.value}
                    change={card.change}
                    isUp={card.isUp}
                  />
                ))
              ) : (
                <div className="col-span-full">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                      Không có dữ liệu
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chart and Top Customers */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <DashboardChart data={chartData} />
              </div>
              <div className="lg:col-span-1">
                <TopCustomers customers={topCustomers} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

