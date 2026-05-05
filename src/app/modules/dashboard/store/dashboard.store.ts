import { create } from 'zustand';
import type { DashboardCardData, DashboardChartData, TopCustomerData, FetchDashboardParams } from '../types';

interface DashboardState {
  cards: DashboardCardData[];
  chartData: DashboardChartData[];
  topCustomers: TopCustomerData[];
  filters: FetchDashboardParams;
  loading: boolean;
  error: string | null;
  chartLoading: boolean;
  chartError: string | null;
  topCustomersLoading: boolean;
  topCustomersError: string | null;

  setCards: (cards: DashboardCardData[]) => void;
  setChartData: (chartData: DashboardChartData[]) => void;
  setTopCustomers: (topCustomers: TopCustomerData[]) => void;
  setFilters: (filters: Partial<FetchDashboardParams>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setChartLoading: (loading: boolean) => void;
  setChartError: (error: string | null) => void;
  setTopCustomersLoading: (loading: boolean) => void;
  setTopCustomersError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  cards: [],
  chartData: [],
  topCustomers: [],
  filters: {},
  loading: false,
  error: null,
  chartLoading: false,
  chartError: null,
  topCustomersLoading: false,
  topCustomersError: null,
};

export const useDashboardStore = create<DashboardState>((set) => ({
  ...initialState,

  setCards: (cards) => set({ cards }),

  setChartData: (chartData) => set({ chartData }),

  setTopCustomers: (topCustomers) => set({ topCustomers }),

  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  setChartLoading: (chartLoading) => set({ chartLoading }),

  setChartError: (chartError) => set({ chartError }),

  setTopCustomersLoading: (topCustomersLoading) => set({ topCustomersLoading }),

  setTopCustomersError: (topCustomersError) => set({ topCustomersError }),

  reset: () => set(initialState),
}));
