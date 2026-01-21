import Link from "next/link"
import { ArrowRight } from "lucide-react"

const products = [
  {
    id: 1,
    name: "Luna Crescent Necklace",
    price: 385,
    image: "/crescent-moon-gold-necklace-luxury-jewelry.jpg",
    href: "/product/luna-crescent-necklace",
  },
  {
    id: 2,
    name: "Celestial Band Ring",
    price: 225,
    image: "/gold-band-ring-with-small-diamonds-luxury.jpg",
    href: "/product/celestial-band-ring",
  },
  {
    id: 3,
    name: "Aurora Drop Earrings",
    price: 295,
    image: "/gold-drop-earrings-elegant-luxury.jpg",
    href: "/product/aurora-drop-earrings",
  },
  {
    id: 4,
    name: "Solstice Pearl Pendant",
    price: 445,
    image: "/pearl-pendant-gold-necklace-luxury-elegant.jpg",
    href: "/product/solstice-pearl-pendant",
  },
  {
    id: 5,
    name: "Starlight Hoops",
    price: 265,
    image: "/gold-hoop-earrings-classic-luxury.jpg",
    href: "/product/starlight-hoops",
  },
  {
    id: 6,
    name: "Eclipse Signet Ring",
    price: 320,
    image: "/gold-signet-ring-minimalist-luxury.jpg",
    href: "/product/eclipse-signet-ring",
  },
]

export function ProductGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Bestsellers</span>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">Featured Pieces</h2>
            <p className="mt-2 text-muted-foreground">Our most coveted designs</p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:text-accent"
          >
            <span className="border-b border-foreground pb-1 transition-colors group-hover:border-accent">
              View All
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={product.href} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-card">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </div>
              <div className="mt-4 space-y-1">
                <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-muted-foreground">${product.price.toLocaleString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
