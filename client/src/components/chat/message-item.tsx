
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bot } from "lucide-react"
import { type Message } from "@/lib/types"

export type { Message }

interface MessageItemProps {
  message: Message
  isStreaming?: boolean
}

export function MessageItem({ message, isStreaming }: MessageItemProps) {
  const isUser = message.role === "user"

  return (
    <div
      className={cn(
        "flex w-full gap-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="size-8 border shrink-0">
        {isUser ? (
          <>
            <AvatarImage src="/avatars/user.png" alt="User" />
            <AvatarFallback>
              <User className="size-4" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/avatars/ai.png" alt="AI" />
            <AvatarFallback>
              <Bot className="size-4" />
            </AvatarFallback>
          </>
        )}
      </Avatar>

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2 rounded-lg px-4 py-3 text-sm",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        )}
      >
        <div className="prose break-words dark:prose-invert prose-sm max-w-none">
          {message.content}
          {isStreaming && (
            <span className="ml-1 inline-block h-4 w-1 animate-pulse bg-current" />
          )}
        </div>
      </div>
    </div>
  )
}
