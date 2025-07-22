// import {
//   QueryClient,
//   QueryClientProvider,
//   QueryCache,
//   MutationCache,
// } from "react-query";
// // OLD (won't work anymore with the latest version):
// // import { QueryClient, QueryClientProvider } from "react-query";

// // ✅ NEW (correct for latest @tanstack/react-query):
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache
} from "@tanstack/react-query";


/**
 * Sets up the QueryClientProvider from react-query.
 * @desc See: https://react-query.tanstack.com/reference/QueryClientProvider#_top
 */
export function QueryProvider({ children }) {
  const client = new QueryClient({
    queryCache: new QueryCache(),
    mutationCache: new MutationCache(),
  });

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
