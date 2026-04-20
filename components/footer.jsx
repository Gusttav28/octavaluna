"use client"

import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function Footer() {
  const { t } = useLanguage()

  const footerLinks = {
    shop: [
      { name: t.footer.allJewelry, href: "/shop" },
      { name: t.categories.necklaces, href: "/shop/necklaces" },
      { name: t.categories.rings, href: "/shop/rings" },
      { name: t.categories.earrings, href: "/shop/earrings" },
      { name: t.categories.bracelets, href: "/shop/bracelets" },
    ],
    company: [
      { name: t.footer.ourStory, href: "/about" },
      { name: t.footer.craftsmanship, href: "/craftsmanship" },
      { name: t.footer.sustainability, href: "/sustainability" },
      { name: t.footer.press, href: "/press" },
      { name: t.footer.careers, href: "/careers" },
    ],
    support: [
      { name: t.footer.contactUs, href: "/contact" },
      { name: t.footer.faqs, href: "/faqs" },
      { name: t.footer.shipping, href: "/shipping" },
      { name: t.footer.returns, href: "/returns" },
      { name: t.footer.ringSizing, href: "/ring-sizing" },
    ],
  }

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="h-2 w-2 rotate-45 bg-accent" />
              <span className="font-serif text-2xl tracking-widest text-foreground">OCTAVA LUNA</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t.footer.tagline}
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="text-muted-foreground transition-colors hover:text-accent">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-accent">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground transition-colors hover:text-accent">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-foreground">{t.footer.shop}</h3>
            <div className="mt-2 h-px w-8 bg-accent" />
            <ul className="mt-4 space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-foreground">{t.footer.company}</h3>
            <div className="mt-2 h-px w-8 bg-accent" />
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-medium uppercase tracking-widest text-foreground">{t.footer.support}</h3>
            <div className="mt-2 h-px w-8 bg-accent" />
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-accent">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Octava Luna. {t.footer.rights}
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground transition-colors hover:text-accent">
              {t.footer.privacy}
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground transition-colors hover:text-accent">
              {t.footer.terms}
            </Link>
          </div>
        </div>
      </div>
      <div className="h-1 w-full bg-accent" />
    </footer>
  )
}
