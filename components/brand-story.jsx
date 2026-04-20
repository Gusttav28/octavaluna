"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/lib/language-context"

export function BrandStory() {
  const { t } = useLanguage()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 border border-accent/20" />
            <div className="aspect-[4/5] overflow-hidden">
              <img
                src="/jewelry-artisan-crafting-gold-necklace-workshop-ha.jpg"
                alt="Artisan crafting jewelry"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-16 h-16 border-b-2 border-r-2 border-accent" />
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-accent" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.brandStory.badge}</span>
            </div>
            <h2 className="mt-6 font-serif text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl text-balance">
              {t.brandStory.title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground">
              {t.brandStory.paragraph1}
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {t.brandStory.paragraph2}
            </p>
            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-3 bg-accent text-accent-foreground px-6 py-3 text-sm font-medium uppercase tracking-widest transition-all hover:bg-accent/90 self-start"
            >
              <span>{t.brandStory.learnMore}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
