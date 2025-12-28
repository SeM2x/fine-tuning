import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ChatProvider } from "@/lib/chat-context"
import { ThemeProvider } from "@/lib/theme-context"
import { Toaster } from "@/components/ui/sonner"
import AppLayout from "@/layouts/AppLayout"
import ChatPage from "@/pages/ChatPage"
import NotFoundPage from "@/pages/NotFoundPage"

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
})

export function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster />
          <ChatProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<ChatPage />} />
                <Route path="/chat/:chatId" element={<ChatPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppLayout>
          </ChatProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
