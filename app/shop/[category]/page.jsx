"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { useSite } from "@/lib/site-context"
import { useProducts } from "@/lib/use-products"
import { getDiscountedPrice, getProductDescription } from "@/lib/products"

export default function ShopCategoryPage() {
  const params = useParams()
  const { t, language } = useLanguage()
  const { formatPrice } = useSite()
  const { products } = useProducts()
  const categorySlug = String(params?.category || "").toLowerCase()

  const filteredProducts = useMemo(
    () => products.filter((product) => String(product.category || "").toLowerCase() === categorySlug),
    [products, categorySlug],
  )

  const title = filteredProducts[0]?.category || categorySlug.replace(/-/g, " ") || t.categoryPage.fallbackTitle

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="bg-secondary px-4 py-20 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.categoryPage.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl capitalize tracking-tight text-foreground sm:text-5xl">{title}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{t.categoryPage.description}</p>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {filteredProducts.length === 0 ? (
              <div className="text-center">
                <p className="text-muted-foreground">{t.categoryPage.empty}</p>
                <Link href="/shop" className="mt-6 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                  {t.categoryPage.backToShop}
                </Link>
              </div>
            ) : (
              <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => {
                  const hasDiscount = Number(product.discountPercent) > 0
                  const price = hasDiscount ? getDiscountedPrice(product.price, product.discountPercent) : Number(product.price || 0)

                  return (
                    <Link key={product.id} href={product.href} className="group">
                      <div className="aspect-[4/5] overflow-hidden bg-card">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h2 className="mt-4 font-serif text-lg text-foreground transition-colors group-hover:text-accent">
                        {product.name}
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{getProductDescription(product, language)}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{formatPrice(price)}</p>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
