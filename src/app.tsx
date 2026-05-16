import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { LoginPage } from './sections/login/login';
import { AppContent } from './main';

const queryClient = new QueryClient();

const AppRouter = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppContent /> : <LoginPage />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
