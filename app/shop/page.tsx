import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = ["All", "Necklaces", "Rings", "Earrings", "Bracelets"]

const products = [
  {
    id: 1,
    name: "Luna Crescent Necklace",
    price: 385,
    category: "Necklaces",
    image: "/crescent-moon-gold-necklace-luxury-jewelry.jpg",
    href: "/product/luna-crescent-necklace",
  },
  {
    id: 2,
    name: "Celestial Band Ring",
    price: 225,
    category: "Rings",
    image: "/gold-band-ring-with-small-diamonds-luxury.jpg",
    href: "/product/celestial-band-ring",
  },
  {
    id: 3,
    name: "Aurora Drop Earrings",
    price: 295,
    category: "Earrings",
    image: "/gold-drop-earrings-elegant-luxury.jpg",
    href: "/product/aurora-drop-earrings",
  },
  {
    id: 4,
    name: "Solstice Pearl Pendant",
    price: 445,
    category: "Necklaces",
    image: "/pearl-pendant-gold-necklace-luxury-elegant.jpg",
    href: "/product/solstice-pearl-pendant",
  },
  {
    id: 5,
    name: "Starlight Hoops",
    price: 265,
    category: "Earrings",
    image: "/gold-hoop-earrings-classic-luxury.jpg",
    href: "/product/starlight-hoops",
  },
  {
    id: 6,
    name: "Eclipse Signet Ring",
    price: 320,
    category: "Rings",
    image: "/gold-signet-ring-minimalist-luxury.jpg",
    href: "/product/eclipse-signet-ring",
  },
  {
    id: 7,
    name: "Moonstone Pendant",
    price: 425,
    category: "Necklaces",
    image: "/gold-necklace-pendant-luxury-jewelry-on-cream-back.jpg",
    href: "/product/moonstone-pendant",
  },
  {
    id: 8,
    name: "Diamond Eternity Ring",
    price: 595,
    category: "Rings",
    image: "/gold-diamond-ring-luxury-jewelry-on-cream-backgrou.jpg",
    href: "/product/diamond-eternity-ring",
  },
  {
    id: 9,
    name: "Cascade Drop Earrings",
    price: 345,
    category: "Earrings",
    image: "/gold-earrings-drop-luxury-jewelry-on-cream-backgro.jpg",
    href: "/product/cascade-drop-earrings",
  },
]

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Banner */}
      <section className="relative bg-secondary py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Explore</span>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Our Collection
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Discover timeless pieces crafted with precision and passion. Each jewel tells a story of elegance and artistry.
          </p>
          <div className="mx-auto mt-6 h-0.5 w-16 bg-accent" />
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-muted-foreground">Filter by:</span>
              <div className="hidden sm:flex items-center gap-2">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                      index === 0
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:text-accent"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="sm:hidden bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link key={product.id} href={product.href} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-card">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  <span className="absolute top-4 left-4 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {product.category}
                  </span>
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

          {/* Load More */}
          <div className="mt-16 text-center">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 bg-transparent">
              Load More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
