"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarDays,
  Image,
  BookOpen,
  Megaphone,
  Clock,
  MessageSquare,
  LogOut,
  Menu,
} from "lucide-react"
import { toast } from "sonner"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Meny", href: "/admin/meny", icon: UtensilsCrossed },
  { label: "Events", href: "/admin/events", icon: CalendarDays },
  { label: "Galleri", href: "/admin/galleri", icon: Image },
  { label: "Reservasjoner", href: "/admin/reservasjoner", icon: BookOpen },
  { label: "Kampanjer", href: "/admin/kampanjer", icon: Megaphone },
  { label: "Apningstider", href: "/admin/apningstider", icon: Clock },
  { label: "Meldinger", href: "/admin/meldinger", icon: MessageSquare },
] as const

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    toast.success("Logget ut")
    router.push("/login")
    router.refresh()
  }

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin" className="block">
          <h1 className="text-lg font-bold text-white">
            <span className="text-neon-cyan">1016</span>{" "}
            <span className="text-neon-pink">Bar</span>{" "}
            <span className="text-gray-400 font-normal text-sm">Admin</span>
          </h1>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-white/5 transition-colors w-full"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Logg ut
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-[#111] border-r border-white/10 lg:block">
        {sidebarContent}
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 bg-[#111] border-b border-white/10 lg:hidden">
        <h1 className="text-sm font-bold text-white">
          <span className="text-neon-cyan">1016</span>{" "}
          <span className="text-neon-pink">Bar</span>{" "}
          <span className="text-gray-400 font-normal text-xs">Admin</span>
        </h1>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-gray-400">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-64 p-0 bg-[#111] border-white/10"
          >
            <SheetTitle className="sr-only">Navigasjon</SheetTitle>
            <SheetDescription className="sr-only">
              Admin navigasjonsmeny
            </SheetDescription>
            {sidebarContent}
          </SheetContent>
        </Sheet>
      </header>

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="p-6 lg:p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
