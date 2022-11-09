import axios from "axios";
import rateLimit, {
  RateLimitedAxiosInstance,
  rateLimitOptions as RateLimitOptions,
} from "axios-rate-limit";
import axiosRetry, {
  isNetworkOrIdempotentRequestError,
  IAxiosRetryConfig,
} from "axios-retry";

/**
 * Creates rate-limited HTTP client to use for fetching pages from npmjs
 */
export default function createAxiosInstance(): RateLimitedAxiosInstance {
  const axiosRetryConfig: IAxiosRetryConfig = {
    retries: 10,
    // Exponential backoff if rate limited or network flakiness. Respect npmjs retry-after header.
    retryDelay: (retryCount, error) => {
      if (
        error.response?.status === 429 &&
        error.response.headers["retry-after"]
      ) {
        return parseInt(error.response.headers["retry-after"], 10) * 1000;
      }

      return axiosRetry.exponentialDelay(retryCount);
    },
    retryCondition: (error) =>
      isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429,
  };

  const axiosRateLimitOptions: RateLimitOptions = {
    maxRequests: 2,
    perMilliseconds: 1000,
    maxRPS: 2,
  };

  const axiosClient = axios.create();

  axiosClient.defaults.headers.common["User-Agent"] =
    "React Native Version Tracker";

  axiosRetry(axiosClient, axiosRetryConfig);
  return rateLimit(axiosClient, axiosRateLimitOptions);
}
