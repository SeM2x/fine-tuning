import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const exampleMessages = [
  {
    heading: "Analyze complex data",
    message: "Help me understand the key trends in this dataset",
  },
  {
    heading: "Generate insights",
    message: "What are the potential implications of this approach?",
  },
  {
    heading: "Solve problems",
    message: "How can I optimize this workflow for better results?",
  },
]

export function EmptyScreen({ setInput }: { setInput: (input: string) => void }) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to Your AI Assistant
        </h1>
        <p className="mb-4 leading-normal text-muted-foreground">
          Powered by a fine-tuned language model, I'm here to help you with your specific needs.
        </p>
        <p className="leading-normal text-muted-foreground">
          Start a conversation or try one of these examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <ArrowRight className="mr-2 size-4 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}
