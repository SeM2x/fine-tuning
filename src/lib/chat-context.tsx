import * as React from "react"
import { type Message } from "@/components/chat/message-item"

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
}

interface ChatContextType {
  chats: Chat[]
  currentChatId: string | null
  createNewChat: () => string
  selectChat: (chatId: string) => void
  addMessage: (message: Message, chatId?: string) => void
  updateMessage: (messageId: string, content: string, chatId?: string) => void
  deleteChat: (chatId: string) => void
}

const ChatContext = React.createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = React.useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = React.useState<string | null>(null)

  const createNewChat = React.useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    return newChat.id
  }, [])

  const selectChat = React.useCallback((chatId: string) => {
    setCurrentChatId(chatId || null)
  }, [])

  const addMessage = React.useCallback((message: Message, chatId?: string) => {
    const targetChatId = chatId || currentChatId
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === targetChatId) {
          const updatedMessages = [...chat.messages, message]
          // Update chat title based on first user message
          const title =
            chat.title === "New Chat" && message.role === "user"
              ? message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")
              : chat.title
          return { ...chat, messages: updatedMessages, title }
        }
        return chat
      })
    )
  }, [currentChatId])

  const updateMessage = React.useCallback((messageId: string, content: string, chatId?: string) => {
    const targetChatId = chatId || currentChatId
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === targetChatId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) =>
              msg.id === messageId ? { ...msg, content } : msg
            ),
          }
        }
        return chat
      })
    )
  }, [currentChatId])

  const deleteChat = React.useCallback((chatId: string) => {
    setChats((prev) => {
      const filtered = prev.filter((chat) => chat.id !== chatId)
      // If deleted current chat, navigate to home
      if (chatId === currentChatId) {
        setCurrentChatId(null)
      }
      return filtered
    })
  }, [currentChatId])

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        createNewChat,
        selectChat,
        addMessage,
        updateMessage,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChatContext() {
  const context = React.useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}
