"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="relative px-4 pb-16 pt-20 sm:px-6 sm:pb-20 sm:pt-24 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-accent" />

      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.3em] text-accent mb-6">
          {t.hero.badge}
        </span>
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl text-balance">
          {t.hero.title}
          <br />
          <span className="italic">{t.hero.titleItalic}</span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {t.hero.description}
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-sm font-medium uppercase tracking-widest transition-all hover:bg-accent/90"
          >
            <span>{t.hero.exploreCollection}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:text-accent"
          >
            <span className="border-b border-foreground pb-1 transition-colors group-hover:border-accent">
              {t.hero.ourStory}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="mx-auto mt-14 w-full max-w-4xl px-2 sm:mt-16 sm:px-6">
        <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[5/3]">
          <img
            src="/elegant-gold-jewelry-necklace-on-cream-silk-fabric.jpg"
            alt="Elegant gold necklace displayed on cream silk"
            className="h-full w-full object-cover object-bottom"
          />
        </div>
      </div>
    </section>
  )
}
