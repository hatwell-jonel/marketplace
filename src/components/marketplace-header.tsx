import { Bell, Mail, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MarketplaceHeader() {
  return (
    <header className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">F</div>
        <h1 className="text-xl font-semibold">Marketplace</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
          <Mail className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:bg-slate-700">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
