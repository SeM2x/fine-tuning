import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useTheme } from "@/lib/theme-context"

export function SettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { theme, toggleTheme } = useTheme()
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="model">Model</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="space-y-4 py-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="notifications">Notifications</Label>
              <Switch id="notifications" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" defaultValue="user@example.com" />
            </div>
          </TabsContent>
          <TabsContent value="model" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="model">Default Model</Label>
              <Input id="model" defaultValue="gpt-4" />
            </div>
            <div className="grid gap-2">
              <Label>Temperature</Label>
              <Slider defaultValue={[0.7]} max={1} step={0.1} />
            </div>
          </TabsContent>
          <TabsContent value="appearance" className="space-y-4 py-4">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch 
                id="dark-mode" 
                checked={theme === "dark"} 
                onCheckedChange={toggleTheme}
              />
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
