import { useCallback, useMemo, useState } from 'react';

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  total?: number;
}

export interface UsePaginationReturn {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  setPage: (page: number) => void;
  setTotal: (total: number) => void;
  setLimit: (limit: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
}

export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10, total: initialTotal = 0 } = options;

  const [page, setPageState] = useState<number>(initialPage);
  const [limit, setLimitState] = useState<number>(initialLimit);
  const [total, setTotalState] = useState<number>(initialTotal);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  const hasPrevPage = page > 1;
  const hasNextPage = page < totalPages;

  const setPage = useCallback(
    (newPage: number) => {
      setPageState(Math.max(1, Math.min(newPage, totalPages)));
    },
    [totalPages]
  );

  const setTotal = useCallback((newTotal: number) => {
    setTotalState(Math.max(0, newTotal));
  }, []);

  const setLimit = useCallback((newLimit: number) => {
    setLimitState(Math.max(1, newLimit));
  }, []);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPageState((prev) => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setPageState((prev) => prev - 1);
    }
  }, [hasPrevPage]);

  const goToPage = useCallback(
    (targetPage: number) => {
      setPage(targetPage);
    },
    [setPage]
  );

  return {
    page,
    limit,
    total,
    totalPages,
    hasPrevPage,
    hasNextPage,
    setPage,
    setTotal,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
  };
}

export default usePagination;
