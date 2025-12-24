import * as React from "react"
import { Send, Paperclip, StopCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface ChatInputProps {
  isLoading?: boolean
  onSend: (message: string) => void
  onStop?: () => void
  input: string
  setInput: (value: string) => void
}

export function ChatInput({ isLoading, onSend, onStop, input, setInput }: ChatInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSend = () => {
    if (input.trim()) {
      onSend(input)
      setInput("")
    }
  }

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  return (
    <div className="relative flex items-end gap-2 rounded-xl border bg-background p-2 shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Attach file</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="min-h-5 w-full resize-none border-0 bg-transparent p-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        rows={1}
      />

      {isLoading ? (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={onStop}
        >
          <StopCircle className="size-4" />
          <span className="sr-only">Stop generating</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0"
          onClick={handleSend}
          disabled={!input.trim()}
        >
          <Send className="size-4" />
          <span className="sr-only">Send message</span>
        </Button>
      )}
    </div>
  )
}
