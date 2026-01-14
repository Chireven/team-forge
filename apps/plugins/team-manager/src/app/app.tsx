import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TeamManagerRoutes } from './lib.routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
          <TeamManagerRoutes />
      </div>
    </QueryClientProvider>
  );
}

export default App;
