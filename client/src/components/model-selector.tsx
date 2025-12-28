import * as React from "react"
import { Check, ChevronsUpDown, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useModels } from "@/hooks/use-models"
import { useChatContext } from "@/lib/chat-context"

export function ModelSelector() {
  const [open, setOpen] = React.useState(false)
  const { selectedModel, setSelectedModel } = useChatContext()
  const { data: models, isLoading, error } = useModels()

  // Set default model when data loads
  React.useEffect(() => {
    if (models && models.length > 0 && !selectedModel) {
      setSelectedModel(models[0].model)
    }
  }, [models, selectedModel, setSelectedModel])

  if (error) {
    return (
      <Button variant="outline" disabled className="w-50 justify-between">
        Error loading models
      </Button>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-50 justify-between"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Loading...
            </>
          ) : selectedModel && models ? (
            models.find((m) => m.model === selectedModel)?.name || "Select model..."
          ) : (
            "Select model..."
          )}
          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder="Search model..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models?.map((m) => (
                <CommandItem
                  key={m.model}
                  value={m.model}
                  onSelect={(currentValue) => {
                    setSelectedModel(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      selectedModel === m.model ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex flex-col">
                    <span>{m.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {m.details.parameter_size}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
