"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useProducts } from "@/lib/use-products"
import { getDiscountedPrice } from "@/lib/products"

export default function ShopPage() {
  const { t } = useLanguage()
  const { products } = useProducts()
  const [activeFilter, setActiveFilter] = useState("all")

  const categoryFilterButtons = useMemo(() => {
    const translated = {
      necklaces: t.shop.necklaces,
      rings: t.shop.rings,
      earrings: t.shop.earrings,
      bracelets: t.shop.bracelets,
    }
    const fromProducts = new Map()
    for (const product of products) {
      const raw = String(product.category || "").trim()
      if (!raw) continue
      const key = raw.toLowerCase()
      if (!fromProducts.has(key)) fromProducts.set(key, raw)
    }
    const sorted = Array.from(fromProducts.entries()).sort((a, b) => a[1].localeCompare(b[1]))
    const dynamic = sorted.map(([key, display]) => ({
      key,
      label: translated[key] || display,
    }))
    return [
      { key: "all", label: t.shop.all },
      { key: "discounted", label: "Discounted" },
      ...dynamic,
    ]
  }, [products, t])

  useEffect(() => {
    const keys = new Set(categoryFilterButtons.map((c) => c.key))
    if (!keys.has(activeFilter)) setActiveFilter("all")
  }, [categoryFilterButtons, activeFilter])

  const filteredProducts = useMemo(() => {
    const sortedProducts = [...products].sort((a, b) => {
      const discountA = Number(a.discountPercent) > 0 ? 1 : 0
      const discountB = Number(b.discountPercent) > 0 ? 1 : 0
      return discountB - discountA
    })

    if (activeFilter === "all") return sortedProducts
    if (activeFilter === "discounted") return sortedProducts.filter((product) => Number(product.discountPercent) > 0)

    return sortedProducts.filter(
      (product) => String(product.category || "").toLowerCase() === activeFilter.toLowerCase(),
    )
  }, [products, activeFilter])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Banner */}
      <section className="relative bg-secondary py-20 px-4">
        <div className="mx-auto max-w-7xl text-center">
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.shop.badge}</span>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t.shop.title}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            {t.shop.description}
          </p>
          <div className="mx-auto mt-6 h-0.5 w-16 bg-accent" />
        </div>
      </section>

      {/* Filter Bar */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              <span className="text-sm font-medium text-muted-foreground">{t.shop.filterBy}</span>
              <div className="hidden sm:flex items-center gap-2">
                {categoryFilterButtons.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setActiveFilter(category.key)}
                    className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${activeFilter === category.key ? "bg-accent text-accent-foreground" : "text-foreground hover:text-accent"
                      }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="sm:hidden bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                {t.shop.filter}
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              {t.shop.sort}
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => {
              const hasDiscount = Number(product.discountPercent) > 0
              const discountedPrice = getDiscountedPrice(product.price, product.discountPercent)
              const inventory = Math.max(0, Number(product.inventory || 0))
              const isOutOfStock = inventory === 0

              return (
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
                  {hasDiscount ? (
                    <span className="absolute top-4 right-4 bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
                      -{Number(product.discountPercent)}%
                    </span>
                  ) : null}
                  {isOutOfStock ? (
                    <span className="absolute bottom-4 left-4 bg-foreground px-3 py-1 text-xs font-medium uppercase tracking-wider text-background">
                      Sold out
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  {hasDiscount ? (
                    <p className="text-sm text-muted-foreground">
                      <span className="text-accent font-medium">${discountedPrice.toLocaleString()}</span>{" "}
                      <span className="line-through">${Number(product.price).toLocaleString()}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">${Number(product.price).toLocaleString()}</p>
                  )}
                </div>
              </Link>
              )
            })}
          </div>

          {/* Load More */}
          <div className="mt-16 text-center">
            <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground px-8 bg-transparent">
              {t.shop.loadMore}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
