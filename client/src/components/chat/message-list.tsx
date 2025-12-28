import * as React from "react"
import { type Message } from "@/lib/types"
import { MessageItem } from "./message-item"
import { TypingIndicator } from "./typing-indicator"

interface MessageListProps {
  messages: Message[]
  isLoading?: boolean
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <MessageItem 
          key={message.id} 
          message={message}
        />
      ))}
      {isLoading && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  )
}
