import { QueryClient, isServer } from '@tanstack/react-query';

/*
 * TanStack Query for everything the browser fetches or sends (src/hooks).
 * Pages still load their content on the server; this is for calls made
 * after the page is open.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Reuse an answer for a minute before asking again.
        staleTime: 60_000,
        retry: 1,
      },
      mutations: {
        // Sending a form or opening checkout twice is worse than an error.
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** A new client per server request; one shared client in the browser. */
export function getQueryClient() {
  if (isServer) return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
