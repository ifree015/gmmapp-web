import {
  useQuery as useQueryOrigin,
  useQueries as useQueriesQueryOrigin,
  useMutation as useMutationOrigin,
  useInfiniteQuery as useInfiniteQueryOrigin,
} from '@tanstack/react-query';

const useQuery = (queryKey, queryFn, options) => {
  return useQueryOrigin(queryKey, queryFn, options);
};

const useQueries = (queries) => {
  return useQueriesQueryOrigin(queries);
};

const useMutation = (mutationFn, options) => {
  return useMutationOrigin(mutationFn, options);
};

const useInfiniteQuery = (queryKey, queryFn, options) => {
  return useInfiniteQueryOrigin(queryKey, queryFn, {
    //   refetchOnMount: false,
    //   cacheTime: 1 * 60 * 1000,
    //   useErrorBoundary: false,
    ...options,
  });
};

export { useQuery, useQueries, useMutation, useInfiniteQuery };
