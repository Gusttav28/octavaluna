"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronDown, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { useSite } from "@/lib/site-context"
import { useProducts } from "@/lib/use-products"
import { getDiscountedPrice, getProductDescription } from "@/lib/products"

export default function ShopPage() {
  const { t, language } = useLanguage()
  const { formatPrice } = useSite()
  const { products } = useProducts()
  const [availabilityFilter, setAvailabilityFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceSort, setPriceSort] = useState("featured")

  const categoryOptions = useMemo(() => {
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
    return dynamic
  }, [products, t])

  const selectedCategory = useMemo(() => {
    const keys = new Set(categoryOptions.map((c) => c.key))
    return keys.has(categoryFilter) ? categoryFilter : "all"
  }, [categoryOptions, categoryFilter])

  const selectedCategoryLabel =
    selectedCategory === "all" ? t.shop.allCategories : categoryOptions.find((category) => category.key === selectedCategory)?.label

  const filteredProducts = useMemo(() => {
    const sortedProducts = [...products].sort((a, b) => {
      const discountA = Number(a.discountPercent) > 0 ? 1 : 0
      const discountB = Number(b.discountPercent) > 0 ? 1 : 0
      return discountB - discountA
    })

    const byAvailability = sortedProducts.filter((product) => {
      const inventory = Math.max(0, Number(product.inventory || 0))
      if (availabilityFilter === "available") return inventory > 0
      if (availabilityFilter === "unavailable") return inventory === 0
      return true
    })

    const byCategory =
      selectedCategory === "all"
        ? byAvailability
        : byAvailability.filter(
            (product) => String(product.category || "").toLowerCase() === selectedCategory.toLowerCase(),
          )

    if (priceSort === "low-high") {
      return [...byCategory].sort((a, b) => getDiscountedPrice(a.price, a.discountPercent) - getDiscountedPrice(b.price, b.discountPercent))
    }

    if (priceSort === "high-low") {
      return [...byCategory].sort((a, b) => getDiscountedPrice(b.price, b.discountPercent) - getDiscountedPrice(a.price, a.discountPercent))
    }

    return byCategory
  }, [products, availabilityFilter, selectedCategory, priceSort])

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
          <div className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="mr-2 flex items-center text-sm font-medium text-muted-foreground">
                <Filter className="mr-2 h-4 w-4" />
                {t.shop.filterBy}
              </span>
              {[
                { key: "all", label: t.shop.allProducts },
                { key: "available", label: t.shop.available },
                { key: "unavailable", label: t.shop.unavailable },
              ].map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setAvailabilityFilter(filter.key)}
                  className={`px-4 py-2 text-sm font-medium uppercase tracking-wider transition-colors ${
                    availabilityFilter === filter.key ? "bg-accent text-accent-foreground" : "text-foreground hover:text-accent"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-transparent uppercase tracking-wider">
                    {selectedCategoryLabel}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setCategoryFilter("all")}>{t.shop.allCategories}</DropdownMenuItem>
                  {categoryOptions.map((category) => (
                    <DropdownMenuItem key={category.key} onClick={() => setCategoryFilter(category.key)}>
                      {category.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="bg-transparent uppercase tracking-wider">
                    {priceSort === "low-high" ? t.shop.priceLowHigh : priceSort === "high-low" ? t.shop.priceHighLow : t.shop.prices}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setPriceSort("featured")}>{t.shop.featuredFirst}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceSort("low-high")}>{t.shop.priceLowHigh}</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPriceSort("high-low")}>{t.shop.priceHighLow}</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
                      {t.shop.soldOut}
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{getProductDescription(product, language)}</p>
                  {hasDiscount ? (
                    <p className="text-sm text-muted-foreground">
                      <span className="text-accent font-medium">{formatPrice(discountedPrice)}</span>{" "}
                      <span className="line-through">{formatPrice(product.price)}</span>
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
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
