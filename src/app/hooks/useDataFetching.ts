import { useState, useMemo } from 'react';

export function useInfiniteScroll<T>(data: T[], pageSize: number) {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading] = useState(false);

  const visibleData = useMemo(() => data.slice(0, page * pageSize), [data, page, pageSize]);
  const hasMore = visibleData.length < data.length;

  const loadMore = async () => {
    setIsLoadingMore(true);
    await new Promise((r) => setTimeout(r, 300));
    setPage((p) => p + 1);
    setIsLoadingMore(false);
  };

  return { visibleData, isLoading, isLoadingMore, loadMore, hasMore };
}

export function usePagination<T>(data: T[], pageSize: number) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, currentPage, pageSize]);

  return { currentPage, setCurrentPage, totalPages, paginatedData, isLoading };
}

export function useDataFetching<T>(
  fetchFn: () => Promise<T>,
  deps: unknown[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch: fetch };
}
