import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MessageList } from "@/components/chat/message-list"
import { ChatInput } from "@/components/chat/chat-input"
import { type Message } from "@/lib/types"
import { EmptyScreen } from "@/components/chat/empty-screen"
import { useChatContext } from "@/lib/chat-context"

export default function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>()
  const navigate = useNavigate()
  const { chats, currentChatId, selectChat, addMessage, updateMessage } = useChatContext()
  const [isLoading, setIsLoading] = React.useState(false)
  const [input, setInput] = React.useState("")
  const [streamingMessageId, setStreamingMessageId] = React.useState<string | null>(null)

  // Sync URL chatId with context
  React.useEffect(() => {
    if (chatId && chatId !== currentChatId) {
      const chatExists = chats.find((chat) => chat.id === chatId)
      if (chatExists) {
        selectChat(chatId)
      } else {
        // Chat doesn't exist, redirect to home
        navigate("/", { replace: true })
      }
    } else if (!chatId && currentChatId) {
      // Update URL to match current chat
      navigate(`/chat/${currentChatId}`, { replace: true })
    }
  }, [chatId, currentChatId, chats, selectChat, navigate])

  const currentChat = chats.find((chat) => chat.id === currentChatId)
  const messages = currentChat?.messages || []

  const handleSend = async (content: string) => {
    if (!currentChatId) return

    const newMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date(),
    }
    addMessage(newMessage)
    setIsLoading(true)

    // Mock AI response with streaming
    setTimeout(() => {
      const aiMessageId = (Date.now() + 1).toString()
      const fullResponse = `This is a mock streaming response from the AI. I am currently in development mode and demonstrating the streaming capability where each character appears one by one. You asked: "${content}"`
      
      setStreamingMessageId(aiMessageId)
      
      // Add empty message first
      const aiResponse: Message = {
        id: aiMessageId,
        role: "assistant",
        content: "",
        createdAt: new Date(),
      }
      addMessage(aiResponse)
      setIsLoading(false)

      // Stream characters one by one
      let currentIndex = 0
      const streamInterval = setInterval(() => {
        if (currentIndex < fullResponse.length) {
          updateMessage(aiMessageId, fullResponse.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          clearInterval(streamInterval)
          setStreamingMessageId(null)
        }
      }, 20)
    }, 500)
  }

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {messages.length === 0 ? (
        <div className="flex flex-1 flex-col justify-center overflow-y-auto">
          <EmptyScreen setInput={setInput} />
        </div>
      ) : (
        <MessageList messages={messages} streamingMessageId={streamingMessageId} />
      )}
      <div className="shrink-0 border-t bg-background p-4">
        <ChatInput
          isLoading={isLoading}
          onSend={handleSend}
          input={input}
          setInput={setInput}
        />
      </div>
    </div>
  )
}
