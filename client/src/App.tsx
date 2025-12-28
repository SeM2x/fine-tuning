import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatProvider } from '@/lib/chat-context';
import { ThemeProvider } from '@/lib/theme-context';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from '@/components/ui/sonner';
// import { ProtectedRoute } from '@/components/ProtectedRoute';
import AppLayout from '@/layouts/AppLayout';
import ChatPage from '@/pages/ChatPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster />
          <AuthProvider>
            <ChatProvider>
              <Routes>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route
                  path='/'
                  element={
                    // <ProtectedRoute>
                      <AppLayout>
                        <ChatPage />
                      </AppLayout>
                    // </ProtectedRoute>
                  }
                />
                <Route
                  path='/chat/:chatId'
                  element={
                    // <ProtectedRoute>
                      <AppLayout>
                        <ChatPage />
                      </AppLayout>
                    // </ProtectedRoute>
                  }
                />

                <Route path='*' element={<NotFoundPage />} />
              </Routes>
            </ChatProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
