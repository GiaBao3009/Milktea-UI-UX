import {
  fetchDashboardStatsApi,
  fetchWarrantyTrendApi,
  reportByProductApi,
} from "./../services/dashboard.api";
import { useCallback } from "react";
import { useDashboardStore } from "../store/dashboard.store";
import {} from "../services/dashboard.api";
import type { FetchDashboardParams } from "../types";

export const useDashboard = () => {
  const {
    cards,
    chartData,
    topCustomers,
    filters,
    loading,
    error,
    chartLoading,
    chartError,
    topCustomersLoading,
    topCustomersError,
    setCards,
    setChartData,
    setTopCustomers,
    setFilters,
    setLoading,
    setError,
    setChartLoading,
    setChartError,
    setTopCustomersLoading,
    setTopCustomersError,
  } = useDashboardStore();

  const fetchDashboardStats = useCallback(
    (params: FetchDashboardParams) => {
      setLoading(true);
      setError(null);

      const payload = {
        ...filters,
        ...params,
      };

      fetchDashboardStatsApi(payload, (response) => {
        if (response.res_code === 0 && response.data?.rows) {
          const { total, activated, expired, not_activated } = response.data.rows;
          setCards([
            { name: "Tổng QR", color: "blue", value: total, change: "", isUp: true },
            { name: "Đã kích hoạt", color: "green", value: activated, change: "", isUp: true },
            { name: "Chưa kích hoạt", color: "yellow", value: not_activated, change: "", isUp: false },
            { name: "Hết hạn", color: "red", value: expired, change: "", isUp: false },
          ]);
        } else {
          setError(response.error_cont || "Failed to fetch dashboard stats");
        }

        setLoading(false);
      });
    },
    [filters, setCards, setLoading, setError],
  );

  const updateFilters = useCallback(
    (newFilters: Partial<FetchDashboardParams>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(newFilters);

      setLoading(true);
      setError(null);
      setCards([]);

      const payload = {
        ...updatedFilters,
      };

      fetchDashboardStatsApi(payload, (response) => {
        if (response.res_code === 0 && response.data?.rows) {
          const { total, activated, expired, not_activated } = response.data.rows;
          setCards([
            { name: "Tổng QR", color: "blue", value: total, change: "", isUp: true },
            { name: "Đã kích hoạt", color: "green", value: activated, change: "", isUp: true },
            { name: "Chưa kích hoạt", color: "yellow", value: not_activated, change: "", isUp: false },
            { name: "Hết hạn", color: "red", value: expired, change: "", isUp: false },
          ]);
        } else {
          setError(response.error_cont || "Failed to fetch dashboard stats");
        }

        setLoading(false);
      });
    },
    [setFilters, setLoading, setError, setCards],
  );

  const fetchWarrantyTrend = useCallback(
    (params: {
      from_date: string;
      to_date: string;
      product_id: number;
      batch_id: number;
      unit: string;
    }) => {
      setChartLoading(true);
      setChartError(null);

      fetchWarrantyTrendApi(params, (response) => {
        if (response.res_code === 0 && Array.isArray(response.data)) {
          setChartData(response.data);
        } else {
          setChartError(response.error_cont || "Failed to fetch warranty trend");
        }

        setChartLoading(false);
      });
    },
    [setChartData, setChartLoading, setChartError],
  );

  const fetchReportByProduct = useCallback(
    (params: FetchDashboardParams) => {
      setTopCustomersLoading(true);
      setTopCustomersError(null);

      reportByProductApi(params, (response) => {
        if (response.res_code === 0 && response.data?.rows) {
          // Transform API response to TopCustomerData format
          const topCustomers = response.data.rows
            .slice(0, 5)
            .map((item: any, index: number) => ({
              customerId: item.product_id,
              customerName: item.product_name,
              customerType: item.series || "Default",
              count: item.total,
            }));

          setTopCustomers(topCustomers);
        } else {
          setTopCustomersError(response.error_cont || "Failed to fetch top products");
        }

        setTopCustomersLoading(false);
      });
    },
    [setTopCustomers, setTopCustomersLoading, setTopCustomersError],
  );

  return {
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
  };
};
