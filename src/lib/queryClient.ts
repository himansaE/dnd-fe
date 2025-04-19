import {
  QueryClient,
  type QueryKey,
  type QueryFilters,
} from "@tanstack/react-query";

// create a new queryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// to cancel the queries
export const cancelQueries = (
  queryKey: QueryKey,
  filters?: Omit<QueryFilters, "queryKey">
) =>
  queryClient.cancelQueries({
    queryKey,
    ...filters,
  });

// to set the data in the cache
export const setQueryData = <T>(
  queryKey: QueryKey,
  updater: T | undefined | ((oldData: T | undefined) => T | undefined)
) => queryClient.setQueryData(queryKey, updater);

export const invalidateQueries = (
  queryKey: QueryKey,
  filters?: Omit<QueryFilters, "queryKey">
) =>
  queryClient.invalidateQueries({
    queryKey,
    ...filters,
  });

// to get the data from the cache
export const getQueryData = <T>(queryKey: QueryKey): T | undefined =>
  queryClient.getQueryData(queryKey);
