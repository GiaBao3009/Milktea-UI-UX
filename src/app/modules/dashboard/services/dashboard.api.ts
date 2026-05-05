import { socketService } from "@app/services/socket";
import { DASHBOARD_EVENTS } from "@app/modules/dashboard/services/events";
import type {
  SocketResponse,
  FetchDashboardParams,
  DashboardChartData,
  StatsResponse,
  ReportByProductResponse,
} from "../types";
import { formatDateToAPI } from "@app/utils/time.utils";

export const fetchDashboardStatsApi = (
  params: FetchDashboardParams,
  callback: (response: SocketResponse<StatsResponse>) => void,
): void => {
  const payload = {
    from_date: params.from_date,
    to_date: params.to_date,
    product_id: params.product_id,
    batch_id: params.batch_id,
  };

  socketService.emit(DASHBOARD_EVENTS.GET_STATS, payload, callback);
};

export const fetchWarrantyTrendApi = (
  params: {
    from_date: string;
    to_date: string;
    product_id: number;
    batch_id: number;
    unit: string;
  },
  callback: (response: SocketResponse<DashboardChartData[]>) => void,
): void => {
  const payload = {
    from_date: params.from_date,
    to_date: params.to_date,
    product_id: params.product_id,
    batch_id: params.batch_id,
    unit: params.unit,
  };

  socketService.emit(DASHBOARD_EVENTS.GET_WARRANTY_TREND, payload, callback);
};

export const reportByProductApi = (
  params: FetchDashboardParams,
  callback: (response: SocketResponse<ReportByProductResponse>) => void,
): void => {
  const payload = {
    from_date: params.from_date,
    to_date: params.to_date,
    product_id: params.product_id,
    batch_id: params.batch_id,
  };

  socketService.emit(DASHBOARD_EVENTS.GET_REPORT_BY_PRODUCT, payload, callback);
};
