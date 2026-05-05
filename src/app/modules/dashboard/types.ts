import type { SocketResponse } from '@app/types/types';

export type { SocketResponse };

export interface DashboardCardData {
  name: string;
  color: string;
  value: number;
  change: string;
  isUp: boolean;
}

export interface FetchDashboardParams {
  from_date: string;
  to_date: string;
  product_id?: number;
  batch_id?: number;
}

export interface DashboardCardListResponse {
  row: DashboardCardData[];
}

export interface DashboardChartData {
    id: number;
    name: string;
    color: string;
    count: number;
}

export interface TopCustomerData {
  customerId: number;
  customerName: string;
  customerType: string;
  count: number;
}

// Real API response shapes
export interface StatsRows {
  total: number;
  activated: number;
  expired: number;
  not_activated: number;
}

export interface StatsResponse {
  rows: StatsRows;
  rowTotal: number;
}

export interface ReportByProductItem {
  product_id: number;
  product_name: string;
  model_code: string;
  series: string;
  total: number;
  activated: number;
  expired: number;
  not_activated: number;
}

export interface ReportByProductResponse {
  rows: ReportByProductItem[];
  rowTotal: number;
}
