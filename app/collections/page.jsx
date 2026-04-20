"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"

export default function CollectionsPage() {
  const { t } = useLanguage()

  const collections = [
    {
      id: 1,
      name: t.collections.celestial,
      description: t.collections.celestialDesc,
      pieces: 12,
      image: "/crescent-moon-gold-necklace-luxury-jewelry.jpg",
      href: "/collections/celestial",
    },
    {
      id: 2,
      name: t.collections.eternal,
      description: t.collections.eternalDesc,
      pieces: 18,
      image: "/gold-band-ring-with-small-diamonds-luxury.jpg",
      href: "/collections/eternal",
    },
    {
      id: 3,
      name: t.collections.pearlEssence,
      description: t.collections.pearlEssenceDesc,
      pieces: 8,
      image: "/pearl-pendant-gold-necklace-luxury-elegant.jpg",
      href: "/collections/pearl-essence",
    },
    {
      id: 4,
      name: t.collections.minimalist,
      description: t.collections.minimalistDesc,
      pieces: 15,
      image: "/gold-signet-ring-minimalist-luxury.jpg",
      href: "/collections/minimalist",
    },
  ]

  const featuredCollection = {
    name: t.collections.lunaCollection,
    tagline: t.collections.newArrival,
    description: t.collections.lunaCollectionDesc,
    image: "/elegant-gold-jewelry-necklace-on-cream-silk-fabric.jpg",
    href: "/collections/luna",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="relative bg-secondary py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.collections.badge}</span>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.collections.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.collections.description}
          </p>
          <div className="mx-auto mt-6 h-0.5 w-16 bg-accent" />
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-[4/5] overflow-hidden bg-card">
              <img
                src={featuredCollection.image || "/placeholder.svg"}
                alt={featuredCollection.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 border border-accent/20" />
            </div>
            <div className="lg:pl-8">
              <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-accent">
                <span className="h-px w-8 bg-accent" />
                {featuredCollection.tagline}
              </span>
              <h2 className="mt-6 font-serif text-4xl tracking-tight text-foreground sm:text-5xl">
                {featuredCollection.name}
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                {featuredCollection.description}
              </p>
              <Link
                href={featuredCollection.href}
                className="mt-8 inline-flex items-center gap-3 group"
              >
                <span className="text-sm font-medium uppercase tracking-widest text-foreground group-hover:text-accent transition-colors border-b border-foreground pb-1 group-hover:border-accent">
                  {t.collections.exploreCollection}
                </span>
                <ArrowRight className="h-4 w-4 text-accent transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.collections.browse}</span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              {t.collections.allCollections}
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            {collections.map((collection) => (
              <Link
                key={collection.id}
                href={collection.href}
                className="group relative overflow-hidden bg-card"
              >
                <div className="grid md:grid-cols-2">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8">
                    <span className="text-xs font-medium uppercase tracking-wider text-accent">
                      {collection.pieces} {t.collections.pieces}
                    </span>
                    <h3 className="mt-2 font-serif text-2xl text-foreground group-hover:text-accent transition-colors">
                      {collection.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                      {collection.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
                      <span>{t.collections.viewCollection}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-accent">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-serif text-3xl tracking-tight text-accent-foreground sm:text-4xl">
            {t.collections.ctaTitle}
          </h2>
          <p className="mt-4 text-accent-foreground/80">
            {t.collections.ctaDescription}
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-background text-foreground px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
          >
            {t.collections.requestCustom}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
