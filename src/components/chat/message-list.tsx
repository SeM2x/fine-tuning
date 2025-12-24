import * as React from "react"
import { type Message } from "@/lib/types"
import { MessageItem } from "./message-item"
import { ScrollArea } from "@/components/ui/scroll-area"

interface MessageListProps {
  messages: Message[]
  streamingMessageId?: string | null
}

export function MessageList({ messages, streamingMessageId }: MessageListProps) {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col gap-4 p-4">
        {messages.map((message) => (
          <MessageItem 
            key={message.id} 
            message={message} 
            isStreaming={message.id === streamingMessageId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}
