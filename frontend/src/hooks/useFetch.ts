import { useCallback, useEffect, useState } from 'react';

export function useFetch<T = unknown>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(Boolean(url));
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (targetUrl: string) => {
    try {
      const res = await fetch(targetUrl);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || 'Something went wrong');
      }

      setData(json);
      setError(null);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!url) return;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((json) => {
            throw new Error(json.message || 'Something went wrong');
          });
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [url]);

  const refetch = useCallback(async () => {
    if (url) {
      setLoading(true);
      await fetchData(url);
    }
  }, [url, fetchData]);

  return { data, loading, error, refetch, setData };
}

export default useFetch;
