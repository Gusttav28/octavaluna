import Link from "next/link"

const categories = [
  {
    name: "Necklaces",
    description: "Elegant chains & pendants",
    image: "/gold-necklace-pendant-luxury-jewelry-on-cream-back.jpg",
    href: "/shop/necklaces",
  },
  {
    name: "Rings",
    description: "Statement pieces & bands",
    image: "/gold-diamond-ring-luxury-jewelry-on-cream-backgrou.jpg",
    href: "/shop/rings",
  },
  {
    name: "Earrings",
    description: "Studs, hoops & drops",
    image: "/gold-earrings-drop-luxury-jewelry-on-cream-backgro.jpg",
    href: "/shop/earrings",
  },
]

export function FeaturedCategories() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-accent" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Collections</span>
            <div className="h-px w-12 bg-accent" />
          </div>
          <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Shop by Category
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground">
            Explore our curated collections of fine jewelry
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link key={category.name} href={category.href} className="group relative overflow-hidden bg-card">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={category.image || "/placeholder.svg"}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-accent/0 transition-colors group-hover:bg-accent/10" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-foreground/60 to-transparent">
                <h3 className="font-serif text-2xl text-card">{category.name}</h3>
                <p className="mt-1 text-sm text-card/80">{category.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
