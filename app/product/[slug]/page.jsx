"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Check, Minus, Plus, Share2, ShoppingBag } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/language-context"
import { useSite } from "@/lib/site-context"
import { useProducts } from "@/lib/use-products"
import { getDiscountedPrice, getProductDescription } from "@/lib/products"

function slugFromHref(href) {
  return String(href || "").split("/").filter(Boolean).pop() || ""
}

export default function ProductDetailPage() {
  const params = useParams()
  const { t, language } = useLanguage()
  const { formatPrice } = useSite()
  const { products } = useProducts()
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [shareMessage, setShareMessage] = useState("")
  const slug = String(params?.slug || "")

  const product = useMemo(
    () => products.find((item) => slugFromHref(item.href) === slug),
    [products, slug],
  )

  const relatedProducts = useMemo(() => {
    if (!product) return products.slice(0, 8)

    const sameCategory = products.filter(
      (item) => item.id !== product.id && String(item.category || "").toLowerCase() === String(product.category || "").toLowerCase(),
    )
    const fallback = products.filter((item) => item.id !== product.id && !sameCategory.some((related) => related.id === item.id))

    return [...sameCategory, ...fallback].slice(0, 8)
  }, [product, products])

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.productDetail.eyebrow}</p>
          <h1 className="mt-4 font-serif text-4xl text-foreground">{t.productDetail.notFoundTitle}</h1>
          <p className="mt-4 text-muted-foreground">{t.productDetail.notFoundDescription}</p>
          <Button asChild className="mt-8">
            <Link href="/shop">{t.productDetail.backToShop}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  const photos = Array.isArray(product.photos) && product.photos.length > 0 ? product.photos : [product.image || "/placeholder.svg"]
  const selectedPhoto = photos[selectedPhotoIndex] || photos[0] || "/placeholder.svg"
  const inventory = Math.max(0, Number(product.inventory || 0))
  const hasDiscount = Number(product.discountPercent) > 0
  const currentPrice = hasDiscount ? getDiscountedPrice(product.price, product.discountPercent) : Number(product.price || 0)
  const maxQuantity = Math.max(1, inventory)
  const safeQuantity = Math.min(quantity, maxQuantity)
  const isOutOfStock = inventory === 0
  const productDescription = getProductDescription(product, language)

  const updateQuantity = (nextQuantity) => {
    setQuantity(Math.max(1, Math.min(maxQuantity, Math.floor(Number(nextQuantity) || 1))))
  }

  const handleShare = async () => {
    const shareUrl = window.location.href

    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: productDescription,
          url: shareUrl,
        })
        setShareMessage(t.productDetail.shared)
        return
      }

      await navigator.clipboard.writeText(shareUrl)
      setShareMessage(t.productDetail.copied)
    } catch {
      setShareMessage(t.productDetail.cancelled)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14">
            <div className="space-y-4">
              <div className="aspect-[4/5] overflow-hidden bg-card">
                <img src={selectedPhoto} alt={product.name} className="h-full w-full object-cover" />
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
                      aria-label={t.productDetail.viewProductPhoto.replace("{number}", String(index + 1))}
                    >
                      <img src={photo} alt={`${product.name} photo ${index + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{product.category}</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground sm:text-5xl">{product.name}</h1>

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <p className="text-2xl font-medium text-foreground">{formatPrice(currentPrice)}</p>
                {hasDiscount ? (
                  <>
                    <p className="text-sm text-muted-foreground line-through">{formatPrice(product.price)}</p>
                    <span className="bg-accent px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
                      -{Number(product.discountPercent)}%
                    </span>
                  </>
                ) : null}
              </div>

              <p className="mt-6 text-base leading-relaxed text-muted-foreground">{productDescription}</p>

              <div className="mt-8 border-y border-border py-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.productDetail.quantity}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {isOutOfStock ? t.productDetail.soldOut : `${inventory} ${t.productDetail.available}`}
                    </p>
                  </div>

                  <div className="flex w-fit items-center border border-border">
                    <button
                      type="button"
                      onClick={() => updateQuantity(safeQuantity - 1)}
                      disabled={safeQuantity <= 1 || isOutOfStock}
                      className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                      aria-label={t.productDetail.decreaseQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      value={isOutOfStock ? 0 : safeQuantity}
                      onChange={(event) => updateQuantity(event.target.value)}
                      disabled={isOutOfStock}
                      className="h-11 w-16 border-x border-border bg-background text-center text-sm outline-none"
                      aria-label={t.productDetail.productQuantity}
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(safeQuantity + 1)}
                      disabled={safeQuantity >= maxQuantity || isOutOfStock}
                      className="flex h-11 w-11 items-center justify-center text-foreground transition-colors hover:bg-secondary disabled:opacity-40"
                      aria-label={t.productDetail.increaseQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
                  <Button className="uppercase tracking-widest" size="lg" disabled={isOutOfStock}>
                    <ShoppingBag className="h-4 w-4" />
                    {isOutOfStock ? t.productDetail.soldOut : t.productDetail.addToBag.replace("{quantity}", String(safeQuantity))}
                  </Button>
                  <Button type="button" variant="outline" size="lg" className="bg-transparent uppercase tracking-widest" onClick={handleShare}>
                    {shareMessage === t.productDetail.copied || shareMessage === t.productDetail.shared ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Share2 className="h-4 w-4" />
                    )}
                    {t.productDetail.share}
                  </Button>
                </div>
                {shareMessage ? <p className="mt-3 text-sm text-accent">{shareMessage}</p> : null}
              </div>

              <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                <p>
                  <span className="font-medium text-foreground">{t.productDetail.category}</span> {product.category}
                </p>
                <p>
                  <span className="font-medium text-foreground">{t.productDetail.photos}</span> {photos.length}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-secondary px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">{t.productDetail.moreFromShop}</p>
                <h2 className="mt-2 font-serif text-3xl text-foreground">{t.productDetail.youMayAlsoLike}</h2>
              </div>
              <Link href="/shop" className="hidden text-sm font-medium uppercase tracking-widest text-foreground hover:text-accent sm:block">
                {t.productDetail.viewAll}
              </Link>
            </div>

            <div className="mt-8 flex gap-5 overflow-x-auto pb-4">
              {relatedProducts.map((item) => {
                const itemHasDiscount = Number(item.discountPercent) > 0
                const itemPrice = itemHasDiscount ? getDiscountedPrice(item.price, item.discountPercent) : Number(item.price || 0)

                return (
                  <Link key={item.id} href={item.href} className="group w-[220px] shrink-0">
                    <div className="aspect-[4/5] overflow-hidden bg-card">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-3 font-serif text-lg text-foreground transition-colors group-hover:text-accent">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{formatPrice(itemPrice)}</p>
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
