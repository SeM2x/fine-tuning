import * as React from "react"
import { useNavigate } from "react-router-dom"
import {
  MessageSquarePlus,
  Settings,
  User,
  MessageSquare,
  Trash2,
  MoreHorizontal,
  Search,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SettingsDialog } from "@/components/settings-dialog"
import { useChatContext } from "@/lib/chat-context"
import { cn } from "@/lib/utils"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const { chats, currentChatId, createNewChat, selectChat, deleteChat } = useChatContext()

  const handleNewChat = () => {
    navigate("/")
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
    navigate(`/chat/${chatId}`)
  }

  const handleDeleteChat = (chatId: string) => {
    deleteChat(chatId)
    // If we deleted the current chat, navigate to home
    if (chatId === currentChatId) {
      navigate("/")
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="p-2">
          <Button className="w-full justify-start gap-2" variant="outline" onClick={handleNewChat}>
            <MessageSquarePlus className="size-4" />
            New Chat
          </Button>
        </div>
        <div className="px-2 pb-2">
           <div className="relative">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input placeholder="Search chats..." className="pl-8" />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton 
                    onClick={() => handleSelectChat(chat.id)}
                    isActive={chat.id === currentChatId}
                    className={cn(
                      "cursor-pointer",
                      chat.id === currentChatId && "bg-sidebar-accent"
                    )}
                  >
                    <MessageSquare className="size-4" />
                    <span className="truncate">{chat.title}</span>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-48" side="right" align="start">
                      <DropdownMenuItem onClick={() => handleDeleteChat(chat.id)}>
                        <Trash2 className="mr-2 size-4" />
                        <span>Delete Chat</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className='w-full'>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">User Name</span>
                    <span className="truncate text-xs">user@example.com</span>
                  </div>
                  <Settings className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
                  <Settings className="mr-2 size-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
      <SettingsDialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </Sidebar>
  )
}
