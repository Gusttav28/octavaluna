"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useLanguage } from "@/lib/language-context"
import { useSite } from "@/lib/site-context"
import { useCollections } from "@/lib/use-collections"
import { useProducts } from "@/lib/use-products"
import { getDiscountedPrice } from "@/lib/products"

function slugFromHref(href) {
  return String(href || "").split("/").filter(Boolean).pop() || ""
}

export default function CollectionDetailPage() {
  const params = useParams()
  const { t } = useLanguage()
  const { formatPrice } = useSite()
  const { collections, featuredCollection } = useCollections()
  const { products } = useProducts()
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const slug = String(params?.slug || "")

  const collection = useMemo(() => {
    const allCollections = [featuredCollection, ...collections]
    return allCollections.find((item) => slugFromHref(item.href) === slug)
  }, [collections, featuredCollection, slug])

  const visibleProducts = useMemo(() => {
    if (!collection) return products

    const collectionWords = String(collection.name || "")
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 3)

    const matched = products.filter((product) => {
      const haystack = `${product.name} ${product.category} ${product.description}`.toLowerCase()
      return collectionWords.some((word) => haystack.includes(word))
    })

    return matched.length > 0 ? matched : products
  }, [collection, products])

  if (!collection) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.collectionDetail.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground">{t.collectionDetail.notFoundTitle}</h1>
          <ButtonLink href="/collections">{t.collectionDetail.backToCollections}</ButtonLink>
        </main>
        <Footer />
      </div>
    )
  }

  const photos = Array.isArray(collection.photos) && collection.photos.length > 0 ? collection.photos : [collection.image || "/placeholder.svg"]
  const selectedPhoto = photos[selectedPhotoIndex] || photos[0] || "/placeholder.svg"

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <div className="aspect-[4/5] overflow-hidden bg-card">
                <img src={selectedPhoto} alt={collection.name} className="h-full w-full object-cover" />
              </div>
              {photos.length > 1 ? (
                <div className="grid grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <button
                      key={`${photo}-${index}`}
                      type="button"
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`aspect-square overflow-hidden border bg-card transition-colors ${
                        selectedPhotoIndex === index ? "border-accent" : "border-border hover:border-accent/60"
                      }`}
                      aria-label={t.collectionDetail.viewCollectionPhoto.replace("{number}", String(index + 1))}
                    >
                      <img src={photo} alt={`${collection.name} photo ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">
                {collection.tagline || t.collectionDetail.fallbackTagline}
              </p>
              <h1 className="mt-4 font-serif text-4xl text-foreground sm:text-5xl">{collection.name}</h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{collection.description}</p>
              <Link href="/shop" className="mt-8 inline-block text-sm font-medium uppercase tracking-widest text-accent">
                {t.collectionDetail.browseShop}
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-secondary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.collectionDetail.products}</p>
            <h2 className="mt-2 font-serif text-3xl text-foreground">{t.collectionDetail.piecesTitle}</h2>

            <div className="mt-8 flex gap-5 overflow-x-auto pb-4">
              {visibleProducts.map((product) => {
                const hasDiscount = Number(product.discountPercent) > 0
                const price = hasDiscount ? getDiscountedPrice(product.price, product.discountPercent) : Number(product.price || 0)

                return (
                  <Link key={product.id} href={product.href} className="group w-[220px] shrink-0">
                    <div className="aspect-[4/5] overflow-hidden bg-card">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-3 font-serif text-lg text-foreground transition-colors group-hover:text-accent">
                      {product.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{formatPrice(price)}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function ButtonLink({ href, children }) {
  return (
    <Link href={href} className="mt-8 inline-block bg-accent px-6 py-3 text-sm font-medium uppercase tracking-widest text-accent-foreground">
      {children}
    </Link>
  )
}
