import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight } from "lucide-react"

const collections = [
  {
    id: 1,
    name: "Celestial",
    description: "Inspired by the moon, stars, and cosmic wonders. Each piece captures the ethereal beauty of the night sky.",
    pieces: 12,
    image: "/crescent-moon-gold-necklace-luxury-jewelry.jpg",
    href: "/collections/celestial",
  },
  {
    id: 2,
    name: "Eternal",
    description: "Timeless designs that transcend trends. Classic elegance meets modern craftsmanship.",
    pieces: 18,
    image: "/gold-band-ring-with-small-diamonds-luxury.jpg",
    href: "/collections/eternal",
  },
  {
    id: 3,
    name: "Pearl Essence",
    description: "The lustrous beauty of freshwater pearls paired with 18k gold. Pure sophistication.",
    pieces: 8,
    image: "/pearl-pendant-gold-necklace-luxury-elegant.jpg",
    href: "/collections/pearl-essence",
  },
  {
    id: 4,
    name: "Minimalist",
    description: "Less is more. Clean lines and understated elegance for the modern woman.",
    pieces: 15,
    image: "/gold-signet-ring-minimalist-luxury.jpg",
    href: "/collections/minimalist",
  },
]

const featuredCollection = {
  name: "The Luna Collection",
  tagline: "New Arrival",
  description: "Our newest collection draws inspiration from the phases of the moon, celebrating the cycles of feminine power and transformation. Each piece is meticulously crafted to capture the mystical allure of moonlight.",
  image: "/elegant-gold-jewelry-necklace-on-cream-silk-fabric.jpg",
  href: "/collections/luna",
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="relative bg-secondary py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Curated</span>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Our Collections
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Each collection tells a unique story, crafted with intention and artistry.
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
                  Explore Collection
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
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Browse</span>
            <h2 className="mt-4 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">
              All Collections
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
                      {collection.pieces} Pieces
                    </span>
                    <h3 className="mt-2 font-serif text-2xl text-foreground group-hover:text-accent transition-colors">
                      {collection.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                      {collection.description}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-sm font-medium uppercase tracking-wider text-foreground group-hover:text-accent transition-colors">
                      <span>View Collection</span>
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
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="mt-4 text-accent-foreground/80">
            Our artisans can create bespoke pieces tailored to your vision. 
            From engagement rings to heirloom pieces, we bring your dreams to life.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 bg-background text-foreground px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-foreground hover:text-background transition-colors"
          >
            Request Custom Design
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
