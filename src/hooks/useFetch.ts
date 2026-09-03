import { useEffect, useState } from "react";
import api from "../services/api";

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(
  endpoint: string
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // Clear old data whenever the endpoint changes
      setData(null);
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<T>(endpoint);

        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "Something went wrong"
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [endpoint]);

  return {
    data,
    loading,
    error,
  };
}

export default useFetch;
export { useFetch };