import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Button>
        <Link to="/">Go back home</Link>
      </Button>
    </div>
  )
}
