"use client"

import Link from "next/link"
import { useState } from "react"
import { DollarSign, ShoppingBag, Search, Menu, User, LogIn, UserPlus, Heart, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { useSite } from "@/lib/site-context"
import type { Language } from "@/lib/translations"



const languages = [
  { code: "en" as Language, name: "English", flag: "EN" },
  { code: "es" as Language, name: "Español", flag: "ES" },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t } = useLanguage()
  const { currency, toggleCurrency } = useSite()

  const navigation = [
    { name: t.nav.shop, href: "/shop" },
    { name: t.nav.collections, href: "/collections" },
    { name: t.nav.about, href: "/about" },
    { name: t.nav.contact, href: "/contact" },
    { name: t.nav.admin, href: "/admin" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-0.5 w-full bg-accent" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Mobile menu */}
          <div className="flex lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">{t.header.openMenu}</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-background overflow-y-auto">
                <div className="flex flex-col min-h-full pb-8">
                  <div className="h-0.5 w-12 bg-accent mb-8 shrink-0" />
                  <nav className="flex flex-col gap-6">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="font-serif text-2xl tracking-wide text-foreground transition-colors hover:text-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>

                  {/* Language section for mobile */}
                  <div className="mt-10 pt-6 border-t border-muted">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.header.language}</p>
                    <div className="flex gap-3">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => setLanguage(lang.code)}
                          type="button"
                          className={`flex items-center gap-2 px-4 py-2 border transition-colors ${language === lang.code
                            ? "border-accent text-accent bg-accent/5"
                            : "border-muted text-foreground hover:border-accent hover:text-accent"
                            }`}
                        >
                          <Globe className="h-4 w-4" />
                          <span className="text-sm font-medium">{lang.flag}</span>
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={toggleCurrency}
                      className="mt-4 flex items-center gap-2 border border-muted px-4 py-2 text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {currency === "USD" ? (
                        <DollarSign className="h-4 w-4" />
                      ) : (
                        <span className="flex h-4 w-4 items-center justify-center text-base font-semibold leading-none">₡</span>
                      )}
                      <span className="text-sm font-medium">{currency}</span>
                    </button>
                  </div>

                  {/* Profile section for mobile */}
                  <div className="mt-8 pt-6 border-t border-muted">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.header.account}</p>
                    <div className="flex flex-col gap-4">
                      <Link
                        href="/account?tab=login"
                        className="flex items-center gap-3 text-foreground transition-colors hover:text-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        <LogIn className="h-5 w-5" />
                        <span className="font-medium">{t.header.signIn}</span>
                      </Link>
                      <Link
                        href="/account?tab=register"
                        className="flex items-center gap-3 text-foreground transition-colors hover:text-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        <UserPlus className="h-5 w-5" />
                        <span className="font-medium">{t.header.createAccount}</span>
                      </Link>
                      <Link
                        href="/account/wishlist"
                        className="flex items-center gap-3 text-foreground transition-colors hover:text-accent"
                        onClick={() => setIsOpen(false)}
                      >
                        <Heart className="h-5 w-5" />
                        <span className="font-medium">{t.header.wishlist}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <span className="hidden sm:block h-2 w-2 rotate-45 bg-accent" />
            <span className="font-serif text-2xl tracking-widest text-foreground">OCTAVA LUNA</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex lg:items-center lg:gap-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:text-accent"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden sm:flex items-center gap-1.5 text-foreground hover:text-white">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    {languages.find((l) => l.code === language)?.flag}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40 bg-background border-muted">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`cursor-pointer flex items-center justify-between ${language === lang.code ? "text-accent" : "text-foreground"
                      }`}
                  >
                    <span>{lang.name}</span>
                    <span className="text-xs text-muted-foreground">{lang.flag}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 text-foreground hover:text-white"
              onClick={toggleCurrency}
              aria-label={t.header.currency}
            >
              {currency === "USD" ? (
                <DollarSign className="h-4 w-4" />
              ) : (
                <span className="flex h-4 w-4 items-center justify-center text-base font-semibold leading-none">₡</span>
              )}
              <span className="text-xs font-medium uppercase tracking-wider">{currency}</span>
            </Button>

            <Button variant="ghost" size="icon" className="text-foreground hover:text-white">
              <Search className="h-5 w-5" />
              <span className="sr-only">{t.header.search}</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="hidden sm:flex text-foreground hover:text-white">
                  <User className="h-5 w-5" />
                  <span className="sr-only">{t.header.account}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background border-muted">
                <div className="px-3 py-2 border-b border-muted">
                  <p className="font-serif text-sm text-foreground">{t.header.welcome}</p>
                  <p className="text-xs text-muted-foreground">{t.header.signInToAccount}</p>
                </div>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/account?tab=login" className="flex items-center gap-2 text-foreground hover:text-white">
                    <LogIn className="h-4 w-4" />
                    <span>{t.header.signIn}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/account?tab=register" className="flex items-center gap-2 text-foreground hover:text-white">
                    <UserPlus className="h-4 w-4" />
                    <span>{t.header.createAccount}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-muted" />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link href="/account/wishlist" className="flex items-center gap-2 text-foreground hover:text-accent">
                    <Heart className="h-4 w-4" />
                    <span>{t.header.wishlist}</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" className="relative text-foreground hover:text-white">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
                0
              </span>
              <span className="sr-only">{t.header.cart}</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
