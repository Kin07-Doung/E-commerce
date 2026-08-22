import { useState, useEffect, useCallback } from 'react';

export const useRateLimit = () => {
  const [rateLimitError, setRateLimitError] = useState('');
  const [retryAfter, setRetryAfter] = useState(0);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const clearRateLimit = useCallback(() => {
    setRateLimitError('');
    setRetryAfter(0);
    setIsRateLimited(false);
  }, []);

  const handleError = useCallback((err) => {
    if (err.response?.status === 429) {
      const retry = err.retryAfter || 60;
      setRetryAfter(retry);
      setRateLimitError(err.response?.data?.message || 'Too many requests. Please try again later.');
      setIsRateLimited(true);
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    let timer;
    if (isRateLimited && retryAfter > 0) {
      timer = setInterval(() => {
        setRetryAfter((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false);
            setRateLimitError('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRateLimited, retryAfter]);

  const RateLimitBanner = () => {
    if (!rateLimitError) return null;
    return (
      <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {rateLimitError}
        {isRateLimited && retryAfter > 0 && (
          <span className="ml-2 font-medium">
            Retry in {retryAfter}s
          </span>
        )}
      </div>
    );
  };

  return { isRateLimited, retryAfter, rateLimitError, handleError, clearRateLimit, RateLimitBanner };
};
