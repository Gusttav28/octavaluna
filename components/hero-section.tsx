import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] sm:min-h-[90vh] md:min-h-[100vh] lg:min-h-[120vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-accent" />

      <div className="mx-auto max-w-4xl mb-60 sm:mb-80 md:mb-90 lg:mb-100 text-center">
        <span className="inline-block text-xs font-medium uppercase tracking-[0.3em] text-accent mb-6">
          Handcrafted Luxury
        </span>
        <h1 className="font-serif text-5xl leading-tight tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl text-balance">
          Timeless elegance
          <br />
          <span className="italic">meets exquisite design</span>
        </h1>
        <p className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Discover our handcrafted jewelry collection, where each piece tells a story of artistry, passion, and
          sophistication.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 bg-accent text-accent-foreground px-8 py-4 text-sm font-medium uppercase tracking-widest transition-all hover:bg-accent/90"
          >
            <span>Explore Collection</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:text-accent"
          >
            <span className="border-b border-foreground pb-1 transition-colors group-hover:border-accent">
              Our Story
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        {/* Decorative hero image */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl px-8">
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src="/elegant-gold-jewelry-necklace-on-cream-silk-fabric.jpg"
            alt="Elegant gold necklace displayed on cream silk"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
        </div>
      </div>

      
    </section>
  )
}
