"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/lib/utils/constants"
import { NeonButton } from "@/components/neon/neon-button"
import { MobileMenu } from "@/components/layout/mobile-menu"

export function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="1016 Bar"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-neon-cyan neon-glow-cyan">1016</span>{" "}
            <span className="text-neon-pink neon-glow-pink">BAR</span>
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.filter((item) => item.label !== "Bordbestilling").map(
            (item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-white/70 hover:text-white transition-colors relative after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-px after:bg-neon-cyan after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-center"
              >
                {item.label}
              </Link>
            )
          )}
          <NeonButton color="pink" size="sm" asChild>
            <Link href="/bordbestilling">Bordbestilling</Link>
          </NeonButton>
        </nav>

        {/* Mobile menu */}
        <MobileMenu />
      </div>
    </header>
  )
}
