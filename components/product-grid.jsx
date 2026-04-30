"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useLanguage } from "@/lib/language-context"
import { useProducts } from "@/lib/use-products"
import { getDiscountedPrice } from "@/lib/products"

export function ProductGrid() {
  const { t } = useLanguage()
  const { products } = useProducts()

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.products.badge}</span>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-foreground sm:text-4xl">{t.products.title}</h2>
            <p className="mt-2 text-muted-foreground">{t.products.description}</p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-foreground transition-colors hover:text-accent"
          >
            <span className="border-b border-foreground pb-1 transition-colors group-hover:border-accent">
              {t.products.viewAll}
            </span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((product) => {
            const hasDiscount = Number(product.discountPercent) > 0
            const discountedPrice = getDiscountedPrice(product.price, product.discountPercent)
            const inventory = Math.max(0, Number(product.inventory || 0))

            return (
              <Link key={product.id} href={product.href} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-card">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
                  {hasDiscount ? (
                    <span className="absolute top-4 right-4 bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
                      On Sale -{Number(product.discountPercent)}%
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
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">Units available: {inventory}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
