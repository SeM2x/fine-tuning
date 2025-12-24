import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ChatProvider } from "@/lib/chat-context"
import { ThemeProvider } from "@/lib/theme-context"
import AppLayout from "@/layouts/AppLayout"
import ChatPage from "@/pages/ChatPage"
import NotFoundPage from "@/pages/NotFoundPage"

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
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
    </BrowserRouter>
  )
}

export default App
