"use client"

import { useEffect, useMemo, useState } from "react"
import { ImagePlus, LoaderCircle, Pencil, Trash2 } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useProducts } from "@/lib/use-products"
import { useCollections } from "@/lib/use-collections"
import { normalizeProduct } from "@/lib/products"
import { mergeUniqueCategoryNames, normalizeCategoryName } from "@/lib/product-categories"
import { useProductCategories } from "@/lib/use-product-categories"
import { mergeUniqueCollectionCategoryNames, normalizeCollectionCategoryName } from "@/lib/collection-categories"
import { useCollectionCategories } from "@/lib/use-collection-categories"
import { useSite } from "@/lib/site-context"
import { useLanguage } from "@/lib/language-context"

const MAX_PRODUCT_PHOTOS = 4

function toPhotoArray(value) {
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
      .slice(0, MAX_PRODUCT_PHOTOS)
  }

  return String(value || "")
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, MAX_PRODUCT_PHOTOS)
}

function toProductHref(title) {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

  return `/product/${slug || "untitled-product"}`
}

function getDraftDescriptions(product) {
  const fallback = typeof product?.description === "string" ? product.description : ""
  return {
    en: typeof product?.descriptions?.en === "string" ? product.descriptions.en : fallback,
    es: typeof product?.descriptions?.es === "string" ? product.descriptions.es : fallback,
  }
}

const SELECT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ""))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function PhotoSlots({ photos, labelPrefix, onUpload, onRemove, t, maxSlots = MAX_PRODUCT_PHOTOS }) {
  const safePhotos = toPhotoArray(photos)

  return (
    <div className={`grid grid-cols-2 gap-3 ${maxSlots > 2 ? "sm:grid-cols-4" : ""}`}>
      {Array.from({ length: maxSlots }).map((_, index) => {
        const photo = safePhotos[index]
        const remainingSlots = maxSlots - safePhotos.length
        const inputId = `${labelPrefix}-photo-${index}`

        return (
          <div key={inputId} className="group relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-white">
            {photo ? (
              <img
                src={photo}
                alt={t.admin.photoAlt.replace("{number}", String(index + 1))}
                className="h-full w-full object-cover"
              />
            ) : (
              <label
                htmlFor={inputId}
                className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 px-3 text-center text-muted-foreground"
              >
                <ImagePlus className="size-8" aria-hidden="true" />
                <span className="text-xs font-medium uppercase tracking-wider">
                  {t.admin.photoSlot.replace("{number}", String(index + 1))}
                </span>
              </label>
            )}

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 p-3 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
              {photo ? (
                <div className="flex gap-2">
                  <Button
                    asChild
                    size="icon-sm"
                    variant="secondary"
                    aria-label={t.admin.editPhoto.replace("{number}", String(index + 1))}
                  >
                    <label htmlFor={inputId} className="cursor-pointer">
                      <Pencil aria-hidden="true" />
                    </label>
                  </Button>
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="destructive"
                    aria-label={t.admin.removePhoto.replace("{number}", String(index + 1))}
                    onClick={() => onRemove?.(index)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm" variant="secondary">
                  <label htmlFor={inputId} className="cursor-pointer">
                    <ImagePlus aria-hidden="true" />
                    {t.admin.addPhotoLeft.replace("{count}", String(remainingSlots))}
                  </label>
                </Button>
              )}
            </div>

            <input
              id={inputId}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => onUpload(index, event.target.files?.[0], event)}
            />
          </div>
        )
      })}
    </div>
  )
}

export default function AdminPage() {
  const { t } = useLanguage()
  const { notify, exchangeRate, setExchangeRate } = useSite()
  const { products, saveProducts, resetProducts, recordProductSale } = useProducts()
  const { categories, ensureCategoriesExist } = useProductCategories()
  const { categories: collectionCategories, ensureCategoriesExist: ensureCollectionCategoriesExist } = useCollectionCategories()
  const { collections, featuredCollection, saveCollections, saveFeaturedCollection, resetCollections } = useCollections()
  const [drafts, setDrafts] = useState(products)
  const [collectionDrafts, setCollectionDrafts] = useState(collections)
  const [featuredCollectionDraft, setFeaturedCollectionDraft] = useState(featuredCollection)
  const [recordingSaleForId, setRecordingSaleForId] = useState(null)
  const [pendingSaleQtyById, setPendingSaleQtyById] = useState({})
  const [message, setMessage] = useState("")
  const [exchangeRateDraft, setExchangeRateDraft] = useState(String(exchangeRate))
  const [savingProductId, setSavingProductId] = useState(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [savingCollectionId, setSavingCollectionId] = useState(null)
  const [isSavingFeaturedCollection, setIsSavingFeaturedCollection] = useState(false)
  const [addCollectionOpen, setAddCollectionOpen] = useState(false)
  const [isAddingCollection, setIsAddingCollection] = useState(false)
  const [activeSection, setActiveSection] = useState("shop")
  const [adminCategoryFilter, setAdminCategoryFilter] = useState("all")
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "",
    descriptions: { en: "", es: "" },
    price: "",
    category: "",
    photos: [],
    discountPercent: "0",
    inventory: "0",
  })
  const [addFormErrors, setAddFormErrors] = useState({})
  const [addFeedback, setAddFeedback] = useState("")
  const [addCollectionForm, setAddCollectionForm] = useState({
    name: "",
    category: "",
    description: "",
    pieces: "0",
    photos: [],
  })
  const [addCollectionFormErrors, setAddCollectionFormErrors] = useState({})
  const [addCollectionFeedback, setAddCollectionFeedback] = useState("")
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")
  const [adminCollectionCategoryFilter, setAdminCollectionCategoryFilter] = useState("all")

  useEffect(() => {
    setDrafts(products.map(normalizeProduct))
  }, [products])

  useEffect(() => {
    setCollectionDrafts(collections)
  }, [collections])

  useEffect(() => {
    setFeaturedCollectionDraft(featuredCollection)
  }, [featuredCollection])

  const productCountLabel = useMemo(() => t.admin.productsCount.replace("{count}", String(drafts.length)), [drafts.length, t])
  const collectionCountLabel = useMemo(
    () => t.admin.collectionsCount.replace("{count}", String(collectionDrafts.length)),
    [collectionDrafts.length, t],
  )

  const categoryOptions = useMemo(
    () => mergeUniqueCategoryNames([categories, drafts.map((p) => p.category).filter(Boolean)]),
    [categories, drafts],
  )

  const collectionCategoryOptions = useMemo(
    () =>
      mergeUniqueCollectionCategoryNames([
        collectionCategories,
        collectionDrafts.map((collection) => collection.category).filter(Boolean),
        [featuredCollectionDraft?.category].filter(Boolean),
      ]),
    [collectionCategories, collectionDrafts, featuredCollectionDraft],
  )

  const filteredDrafts = useMemo(() => {
    if (adminCategoryFilter === "all") return drafts
    return drafts.filter(
      (p) => String(p.category || "").toLowerCase() === String(adminCategoryFilter).toLowerCase(),
    )
  }, [drafts, adminCategoryFilter])

  const filteredCollectionDrafts = useMemo(() => {
    if (adminCollectionCategoryFilter === "all") return collectionDrafts
    return collectionDrafts.filter(
      (collection) => String(collection.category || "").toLowerCase() === String(adminCollectionCategoryFilter).toLowerCase(),
    )
  }, [collectionDrafts, adminCollectionCategoryFilter])

  const deleteTargetProduct = useMemo(
    () => drafts.find((p) => p.id === deleteTargetId) || null,
    [drafts, deleteTargetId],
  )

  const handleSaveExchangeRate = () => {
    const nextRate = Number(exchangeRateDraft)
    if (!Number.isFinite(nextRate) || nextRate <= 0) {
      setMessage(t.admin.exchangeRateError)
      return
    }

    setExchangeRate(nextRate)
    setMessage("")
    notify(t.admin.exchangeRateSaved)
  }

  useEffect(() => {
    if (adminCategoryFilter === "all") return
    const exists = categoryOptions.some((c) => c.toLowerCase() === adminCategoryFilter.toLowerCase())
    if (!exists) setAdminCategoryFilter("all")
  }, [adminCategoryFilter, categoryOptions])

  useEffect(() => {
    if (adminCollectionCategoryFilter === "all") return
    const exists = collectionCategoryOptions.some((category) => category.toLowerCase() === adminCollectionCategoryFilter.toLowerCase())
    if (!exists) setAdminCollectionCategoryFilter("all")
  }, [adminCollectionCategoryFilter, collectionCategoryOptions])

  const updateDraft = (id, key, value) => {
    setDrafts((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const updateDraftDescription = (id, language, value) => {
    setDrafts((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const descriptions = getDraftDescriptions(item)
        return {
          ...item,
          description: language === "en" ? value : descriptions.en,
          descriptions: { ...descriptions, [language]: value },
        }
      }),
    )
  }

  const uploadDraftPhoto = async (id, index, file, event) => {
    if (!file) return
    const dataUrl = await readImageFile(file)
    setDrafts((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const photos = toPhotoArray(item.photos || [])
        return {
          ...item,
          photos: [...photos.slice(0, index), dataUrl, ...photos.slice(index + 1)].slice(0, MAX_PRODUCT_PHOTOS),
        }
      }),
    )
    if (event?.target) event.target.value = ""
  }

  const removeDraftPhoto = (id, index) => {
    setDrafts((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        return {
          ...item,
          photos: toPhotoArray(item.photos || []).filter((_, photoIndex) => photoIndex !== index),
        }
      }),
    )
  }

  const uploadAddFormPhoto = async (index, file, event) => {
    if (!file) return
    const dataUrl = await readImageFile(file)
    setAddForm((current) => {
      const photos = toPhotoArray(current.photos)
      return {
        ...current,
        photos: [...photos.slice(0, index), dataUrl, ...photos.slice(index + 1)].slice(0, MAX_PRODUCT_PHOTOS),
      }
    })
    if (event?.target) event.target.value = ""
  }

  const removeAddFormPhoto = (index) => {
    setAddForm((current) => ({
      ...current,
      photos: toPhotoArray(current.photos).filter((_, photoIndex) => photoIndex !== index),
    }))
  }

  const uploadAddCollectionPhoto = async (index, file, event) => {
    if (!file) return
    const dataUrl = await readImageFile(file)
    setAddCollectionForm((current) => {
      const photos = toPhotoArray(current.photos)
      return {
        ...current,
        photos: [...photos.slice(0, index), dataUrl, ...photos.slice(index + 1)].slice(0, MAX_PRODUCT_PHOTOS),
      }
    })
    if (event?.target) event.target.value = ""
  }

  const removeAddCollectionPhoto = (index) => {
    setAddCollectionForm((current) => ({
      ...current,
      photos: toPhotoArray(current.photos).filter((_, photoIndex) => photoIndex !== index),
    }))
  }

  const uploadCollectionPhoto = async (id, index, file, event) => {
    if (!file) return
    const dataUrl = await readImageFile(file)
    setCollectionDrafts((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const photos = toPhotoArray(item.photos || [item.image])
        const nextPhotos = [...photos.slice(0, index), dataUrl, ...photos.slice(index + 1)].slice(0, MAX_PRODUCT_PHOTOS)
        return {
          ...item,
          photos: nextPhotos,
          image: nextPhotos[0] || "",
        }
      }),
    )
    if (event?.target) event.target.value = ""
  }

  const removeCollectionPhoto = (id, index) => {
    setCollectionDrafts((current) =>
      current.map((item) => {
        if (item.id !== id) return item
        const nextPhotos = toPhotoArray(item.photos || [item.image]).filter((_, photoIndex) => photoIndex !== index)
        return {
          ...item,
          photos: nextPhotos,
          image: nextPhotos[0] || "",
        }
      }),
    )
  }

  const uploadFeaturedCollectionPhoto = async (index, file, event) => {
    if (!file) return
    const dataUrl = await readImageFile(file)
    setFeaturedCollectionDraft((current) => {
      const photos = toPhotoArray(current.photos || [current.image])
      const nextPhotos = [...photos.slice(0, index), dataUrl, ...photos.slice(index + 1)].slice(0, MAX_PRODUCT_PHOTOS)
      return {
        ...current,
        photos: nextPhotos,
        image: nextPhotos[0] || "",
      }
    })
    if (event?.target) event.target.value = ""
  }

  const removeFeaturedCollectionPhoto = (index) => {
    setFeaturedCollectionDraft((current) => {
      const nextPhotos = toPhotoArray(current.photos || [current.image]).filter((_, photoIndex) => photoIndex !== index)
      return {
        ...current,
        photos: nextPhotos,
        image: nextPhotos[0] || "",
      }
    })
  }

  const updateCollectionDraft = (id, key, value) => {
    setCollectionDrafts((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const updateFeaturedCollectionDraft = (key, value) => {
    setFeaturedCollectionDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSaveProduct = async (id) => {
    setSavingProductId(id)
    setMessage("")

    const nextProducts = drafts.map((item) => {
      if (item.id !== id) return item

      const normalizedPhotos =
        Array.isArray(item.photos) && item.photos.length > 0
          ? item.photos.filter(Boolean).slice(0, MAX_PRODUCT_PHOTOS)
          : [item.image].filter(Boolean)
      const descriptions = getDraftDescriptions(item)

      return {
        ...item,
        name: item.name.trim() || t.admin.untitledProduct,
        description: descriptions.en.trim(),
        descriptions: {
          en: descriptions.en.trim(),
          es: descriptions.es.trim() || descriptions.en.trim(),
        },
        price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
        discountPercent: Math.max(0, Math.min(100, Number(item.discountPercent) || 0)),
        inventory: Math.max(0, Math.floor(Number(item.inventory) || 0)),
        unitsSoldTotal: Math.max(0, Math.floor(Number(item.unitsSoldTotal) || 0)),
        photos: normalizedPhotos,
        image: normalizedPhotos[0] || "/placeholder.svg",
        href: toProductHref(item.name),
        category: normalizeCategoryName(item.category) || t.admin.uncategorized,
      }
    })

    saveProducts(nextProducts)
    const saved = nextProducts.find((p) => p.id === id)
    if (saved?.category) ensureCategoriesExist([saved.category])
    await new Promise((resolve) => setTimeout(resolve, 350))
    setSavingProductId(null)
    notify(t.admin.productSaved.replace("{name}", saved?.name || t.admin.productFallback))
  }

  const handleSubmitNewProduct = async () => {
    setAddFormErrors({})
    setAddFeedback("")
    const errors = {}
    const name = addForm.name.trim()
    const descriptions = {
      en: String(addForm.descriptions?.en || "").trim(),
      es: String(addForm.descriptions?.es || "").trim(),
    }
    const price = Number(addForm.price)
    const category = normalizeCategoryName(addForm.category)
    const photos = toPhotoArray(addForm.photos)
    const discountPercent = Number(addForm.discountPercent)
    const inventory = Math.floor(Number(addForm.inventory))

    if (!name) errors.name = t.admin.nameRequired
    if (!descriptions.en) errors.descriptionEn = t.admin.descriptionEnglishRequired
    if (!descriptions.es) errors.descriptionEs = t.admin.descriptionSpanishRequired
    if (!Number.isFinite(price) || price < 0) errors.price = t.admin.validPriceRequired
    if (!category) errors.category = t.admin.categoryRequired
    if (photos.length === 0) errors.photos = t.admin.photoRequired
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      errors.discountPercent = t.admin.discountRequired
    }
    if (!Number.isFinite(inventory) || inventory < 0) errors.inventory = t.admin.inventoryRequired

    if (Object.keys(errors).length > 0) {
      setAddFormErrors(errors)
      setAddFeedback(t.admin.fixHighlighted)
      return
    }

    setIsAddingProduct(true)
    const nextId = Math.max(0, ...drafts.map((p) => Number(p.id) || 0)) + 1
    const normalized = normalizeProduct({
      id: nextId,
      name,
      description: descriptions.en,
      descriptions,
      price,
      category,
      photos,
      discountPercent,
      inventory,
      unitsSoldTotal: 0,
      href: toProductHref(name),
    })

    const nextProducts = [...drafts, normalized]
    saveProducts(nextProducts)
    ensureCategoriesExist([category])
    await new Promise((resolve) => setTimeout(resolve, 350))
    setIsAddingProduct(false)
    setAddProductOpen(false)
    setAddForm({
      name: "",
      descriptions: { en: "", es: "" },
      price: "",
      category: "",
      photos: [],
      discountPercent: "0",
      inventory: "0",
    })
    notify(t.admin.productAdded.replace("{name}", name))
  }

  const openDeleteProduct = (id) => {
    setDeleteTargetId(id)
    setDeleteConfirmText("")
  }

  const closeDeleteProduct = () => {
    setDeleteTargetId(null)
    setDeleteConfirmText("")
  }

  const confirmDeleteProduct = () => {
    if (deleteConfirmText !== "DELETE" || deleteTargetId == null) return
    const nextProducts = drafts.filter((p) => p.id !== deleteTargetId)
    saveProducts(nextProducts)
    closeDeleteProduct()
    setRecordingSaleForId(null)
    notify(t.admin.productRemoved)
  }

  const startRecordingSale = (id) => {
    setRecordingSaleForId(id)
    setPendingSaleQtyById((current) => ({ ...current, [id]: current[id] ?? "1" }))
    setMessage("")
  }

  const cancelRecordingSale = () => {
    setRecordingSaleForId(null)
  }

  const confirmRecordSale = (id) => {
    const selectedProduct = drafts.find((product) => product.id === id)
    const currentInventory = Number(selectedProduct?.inventory || 0)
    const quantityToSell = Math.max(1, Math.floor(Number(pendingSaleQtyById[id]) || 1))

    if (currentInventory <= 0) {
      setMessage(t.admin.outOfStock)
      return
    }

    if (quantityToSell > currentInventory) {
      setMessage(t.admin.notEnoughInventory.replace("{count}", String(currentInventory)))
      return
    }

    recordProductSale(id, quantityToSell)
    setRecordingSaleForId(null)
    notify(t.admin.saleRecorded.replace("{count}", String(quantityToSell)))
  }

  const handleSaveCollection = async (id) => {
    setSavingCollectionId(id)
    const nextCollections = collectionDrafts.map((collection) => {
      if (collection.id !== id) return collection

      const safeName = collection.name?.trim() || t.admin.untitledCollection
      const safeCategory = normalizeCollectionCategoryName(collection.category) || t.admin.uncategorized

      return {
        ...collection,
        name: safeName,
        category: safeCategory,
        pieces: Math.max(0, Number(collection.pieces) || 0),
        photos:
          Array.isArray(collection.photos) && collection.photos.length > 0
            ? collection.photos.filter(Boolean).slice(0, MAX_PRODUCT_PHOTOS)
            : [collection.image].filter(Boolean),
        image:
          (Array.isArray(collection.photos) && collection.photos.length > 0
            ? collection.photos.filter(Boolean).slice(0, MAX_PRODUCT_PHOTOS)[0]
            : collection.image) || "/placeholder.svg",
        href: `/collections/${safeName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}`,
      }
    })

    saveCollections(nextCollections)
    const saved = nextCollections.find((collection) => collection.id === id)
    if (saved?.category) ensureCollectionCategoriesExist([saved.category])
    await new Promise((resolve) => setTimeout(resolve, 350))
    setSavingCollectionId(null)
    notify(t.admin.collectionSaved.replace("{name}", saved?.name || t.admin.collectionFallback))
  }

  const handleSaveFeaturedCollection = async () => {
    setIsSavingFeaturedCollection(true)
    const safeName = featuredCollectionDraft.name?.trim() || t.admin.featuredCollectionFallback
    const safeCategory = normalizeCollectionCategoryName(featuredCollectionDraft.category) || t.admin.uncategorized
    const safeTagline = featuredCollectionDraft.tagline?.trim() || t.admin.featuredFallback
    const safeDescription = featuredCollectionDraft.description?.trim() || ""
    const safePhotos =
      Array.isArray(featuredCollectionDraft.photos) && featuredCollectionDraft.photos.length > 0
        ? featuredCollectionDraft.photos.filter(Boolean).slice(0, MAX_PRODUCT_PHOTOS)
        : [featuredCollectionDraft.image].filter(Boolean)
    const safeImage = safePhotos[0] || "/placeholder.svg"

    const nextFeaturedCollection = {
      ...featuredCollectionDraft,
      name: safeName,
      category: safeCategory,
      tagline: safeTagline,
      description: safeDescription,
      photos: safePhotos,
      image: safeImage,
      href: `/collections/${safeName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}`,
    }

    saveFeaturedCollection(nextFeaturedCollection)
    ensureCollectionCategoriesExist([safeCategory])
    await new Promise((resolve) => setTimeout(resolve, 350))
    setIsSavingFeaturedCollection(false)
    notify(t.admin.featuredCollectionSaved)
  }

  const handleSubmitNewCollection = async () => {
    setAddCollectionFormErrors({})
    setAddCollectionFeedback("")

    const errors = {}
    const name = addCollectionForm.name.trim()
    const category = normalizeCollectionCategoryName(addCollectionForm.category)
    const description = addCollectionForm.description.trim()
    const pieces = Math.floor(Number(addCollectionForm.pieces))
    const photos = toPhotoArray(addCollectionForm.photos)

    if (!name) errors.name = t.admin.nameRequired
    if (!category) errors.category = t.admin.categoryRequired
    if (!description) errors.description = t.admin.descriptionRequired
    if (!Number.isFinite(pieces) || pieces < 0) errors.pieces = t.admin.piecesRequired
    if (photos.length === 0) errors.photos = t.admin.collectionPhotoRequired

    if (Object.keys(errors).length > 0) {
      setAddCollectionFormErrors(errors)
      setAddCollectionFeedback(t.admin.fixHighlighted)
      return
    }

    setIsAddingCollection(true)
    const nextId = Math.max(0, ...collectionDrafts.map((collection) => Number(collection.id) || 0)) + 1
    const safeSlug = name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")
    const nextCollection = {
      id: nextId,
      name,
      category,
      description,
      pieces,
      photos,
      image: photos[0] || "/placeholder.svg",
      href: `/collections/${safeSlug || "untitled-collection"}`,
    }

    saveCollections([...collectionDrafts, nextCollection])
    ensureCollectionCategoriesExist([category])
    await new Promise((resolve) => setTimeout(resolve, 350))
    setIsAddingCollection(false)
    setAddCollectionOpen(false)
    setAddCollectionForm({
      name: "",
      category: "",
      description: "",
      pieces: "0",
      photos: [],
    })
    notify(t.admin.collectionAdded.replace("{name}", name))
  }

  const handleResetProducts = () => {
    resetProducts()
    notify(t.admin.productsReset)
  }

  const handleResetCollections = () => {
    resetCollections()
    notify(t.admin.collectionsReset)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl text-foreground">{t.admin.panelTitle}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.admin.panelDescription}</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-accent">
              {activeSection === "shop" ? productCountLabel : collectionCountLabel}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeSection === "shop" ? "default" : "outline"}
              onClick={() => setActiveSection("shop")}
              className={activeSection === "shop" ? "" : "bg-transparent"}
            >
              {t.admin.shopProducts}
            </Button>
            <Button
              variant={activeSection === "collections" ? "default" : "outline"}
              onClick={() => setActiveSection("collections")}
              className={activeSection === "collections" ? "" : "bg-transparent"}
            >
              {t.admin.collections}
            </Button>
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-destructive">{message}</p> : null}

        <section className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-accent">{t.admin.currencySettings}</p>
              <h2 className="mt-1 font-serif text-2xl text-foreground">{t.admin.exchangeRateTitle}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{t.admin.exchangeRateDescription}</p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="crc-rate">{t.admin.exchangeRateLabel}</Label>
                <Input
                  id="crc-rate"
                  type="number"
                  min="1"
                  step="0.01"
                  value={exchangeRateDraft}
                  onChange={(event) => setExchangeRateDraft(event.target.value)}
                  placeholder="520"
                  className="sm:w-44"
                />
              </div>
              <Button type="button" onClick={handleSaveExchangeRate}>
                {t.admin.saveExchangeRate}
              </Button>
            </div>
          </div>
        </section>

        {activeSection === "shop" ? (
          <>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <Button
                size="lg"
                className="w-full sm:w-auto font-medium uppercase tracking-wider"
                onClick={() => {
                  setAddFormErrors({})
                  setAddFeedback("")
                  setAddForm({
                    name: "",
                    descriptions: { en: "", es: "" },
                    price: "",
                    category: categoryOptions[0] || "",
                    photos: [],
                    discountPercent: "0",
                    inventory: "0",
                  })
                  setAddProductOpen(true)
                }}
              >
                {t.admin.addProduct}
              </Button>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex flex-col mb-5 gap-1 sm:min-w-[220px]">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">{t.admin.filterByCategory}</Label>
                  <select
                    className={SELECT_CLASS}
                    value={adminCategoryFilter}
                    onChange={(event) => setAdminCategoryFilter(event.target.value)}
                  >
                    <option value="all">{t.admin.allCategories}</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" onClick={handleResetProducts} className="bg-transparent shrink-0">
                  {t.admin.resetProducts}
                </Button>
              </div>
            </div>

            <section className="mt-8 space-y-6">
              {filteredDrafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.admin.noProductsMatch}</p>
              ) : null}
              {filteredDrafts.map((product) => (
                <article key={product.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-end gap-2">
                    <Button type="button" variant="destructive" size="sm" onClick={() => openDeleteProduct(product.id)}>
                      {t.admin.deleteProduct}
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-md border border-border bg-background/50 p-4">
                      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-accent">
                        {t.admin.productEssentials}
                      </p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t.admin.productPhotos}
                          </label>
                          <p className="text-[11px] text-muted-foreground">
                            {t.admin.addImagesHelp.replace("{count}", String(MAX_PRODUCT_PHOTOS))}
                          </p>
                          <PhotoSlots
                            photos={product.photos || [product.image]}
                            t={t}
                            labelPrefix={`product-${product.id}`}
                            onUpload={(index, file, event) => uploadDraftPhoto(product.id, index, file, event)}
                            onRemove={(index) => removeDraftPhoto(product.id, index)}
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {t.admin.title}
                              </label>
                              <Input
                                value={product.name}
                                onChange={(event) => updateDraft(product.id, "name", event.target.value)}
                                placeholder={t.admin.productTitlePlaceholder}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {t.admin.price}
                              </label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={product.price}
                                onChange={(event) => updateDraft(product.id, "price", event.target.value)}
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{t.admin.category}</label>
                        <p className="text-[11px] text-muted-foreground">
                          {t.admin.categoryHelp}
                        </p>
                        <Input
                          list={`admin-category-datalist-${product.id}`}
                          value={product.category ?? ""}
                          onChange={(event) => updateDraft(product.id, "category", event.target.value)}
                          placeholder={t.admin.categoryPlaceholder}
                          autoComplete="off"
                        />
                        <datalist id={`admin-category-datalist-${product.id}`}>
                          {categoryOptions.map((cat) => (
                            <option key={cat} value={cat} />
                          ))}
                        </datalist>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t.admin.discountPercent}
                        </label>
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          step="1"
                          value={product.discountPercent || 0}
                          onChange={(event) => updateDraft(product.id, "discountPercent", event.target.value)}
                          placeholder="0"
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t.admin.descriptionEnglish}
                          </label>
                          <Textarea
                            value={getDraftDescriptions(product).en}
                            onChange={(event) => updateDraftDescription(product.id, "en", event.target.value)}
                            placeholder={t.admin.productDescriptionPlaceholder}
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t.admin.descriptionSpanish}
                          </label>
                          <Textarea
                            value={getDraftDescriptions(product).es}
                            onChange={(event) => updateDraftDescription(product.id, "es", event.target.value)}
                            placeholder={t.admin.productDescriptionSpanishPlaceholder}
                            rows={4}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {t.admin.productLink}
                        </label>
                        <Input value={toProductHref(product.name)} disabled readOnly />
                      </div>

                      <div className="space-y-4 border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground">
                          {t.admin.saleHelp}
                        </p>

                        {recordingSaleForId === product.id ? (
                          <div className="rounded-md border border-border bg-secondary/40 p-4 space-y-3">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              {t.admin.unitsInSale}
                            </label>
                            <Input
                              type="number"
                              min="1"
                              step="1"
                              value={pendingSaleQtyById[product.id] ?? "1"}
                              onChange={(event) =>
                                setPendingSaleQtyById((current) => ({
                                  ...current,
                                  [product.id]: event.target.value,
                                }))
                              }
                              className="max-w-xs"
                            />
                            <div className="flex flex-wrap gap-2">
                              <Button type="button" onClick={() => confirmRecordSale(product.id)}>
                                {t.admin.confirmSale}
                              </Button>
                              <Button type="button" variant="outline" onClick={cancelRecordingSale} className="bg-transparent">
                                {t.admin.cancel}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => startRecordingSale(product.id)}
                            className="bg-transparent"
                            disabled={Number(product.inventory || 0) <= 0}
                          >
                            {t.admin.recordOffsiteSale}
                          </Button>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              {t.admin.unitsSold}
                            </label>
                            <Input
                              type="number"
                              value={product.unitsSoldTotal ?? 0}
                              disabled
                              readOnly
                              className="bg-muted/50"
                            />
                            <p className="text-[11px] text-muted-foreground">
                              {t.admin.unitsSoldHelp}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              {t.admin.unitsAvailable}
                            </label>
                            <Input
                              type="number"
                              min="0"
                              step="1"
                              value={product.inventory ?? 0}
                              onChange={(event) => updateDraft(product.id, "inventory", event.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <Button onClick={() => handleSaveProduct(product.id)} disabled={savingProductId === product.id}>
                            {savingProductId === product.id ? (
                              <>
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                {t.admin.saving}
                              </>
                            ) : (
                              t.admin.saveChanges
                            )}
                          </Button>
                        </div>
                      </div>
                  </div>
                </article>
              ))}
            </section>

            <Dialog
              open={addProductOpen}
              onOpenChange={(open) => {
                setAddProductOpen(open)
                if (!open) {
                  setAddFormErrors({})
                  setAddFeedback("")
                }
              }}
            >
              <DialogContent className="max-h-[min(90vh,720px)] max-w-lg overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t.admin.addProduct}</DialogTitle>
                  <DialogDescription>{t.admin.addProductDescription}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  {addFeedback ? <p className="text-sm text-destructive">{addFeedback}</p> : null}
                  <div className="space-y-2">
                    <Label htmlFor="add-name">{t.admin.name}</Label>
                    <Input
                      id="add-name"
                      value={addForm.name}
                      onChange={(event) => setAddForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder={t.admin.productNamePlaceholder}
                      aria-invalid={Boolean(addFormErrors.name)}
                    />
                    {addFormErrors.name ? <p className="text-xs text-destructive">{addFormErrors.name}</p> : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="add-desc-en">{t.admin.descriptionEnglish}</Label>
                      <Textarea
                        id="add-desc-en"
                        value={addForm.descriptions.en}
                        onChange={(event) =>
                          setAddForm((current) => ({
                            ...current,
                            descriptions: { ...current.descriptions, en: event.target.value },
                          }))
                        }
                        placeholder={t.admin.shortDescriptionPlaceholder}
                        rows={4}
                        aria-invalid={Boolean(addFormErrors.descriptionEn)}
                      />
                      {addFormErrors.descriptionEn ? <p className="text-xs text-destructive">{addFormErrors.descriptionEn}</p> : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-desc-es">{t.admin.descriptionSpanish}</Label>
                      <Textarea
                        id="add-desc-es"
                        value={addForm.descriptions.es}
                        onChange={(event) =>
                          setAddForm((current) => ({
                            ...current,
                            descriptions: { ...current.descriptions, es: event.target.value },
                          }))
                        }
                        placeholder={t.admin.shortDescriptionSpanishPlaceholder}
                        rows={4}
                        aria-invalid={Boolean(addFormErrors.descriptionEs)}
                      />
                      {addFormErrors.descriptionEs ? <p className="text-xs text-destructive">{addFormErrors.descriptionEs}</p> : null}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="add-price">{t.admin.price}</Label>
                      <Input
                        id="add-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={addForm.price}
                        onChange={(event) => setAddForm((current) => ({ ...current, price: event.target.value }))}
                        placeholder="0.00"
                        aria-invalid={Boolean(addFormErrors.price)}
                      />
                      {addFormErrors.price ? <p className="text-xs text-destructive">{addFormErrors.price}</p> : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="add-inv">{t.admin.unitsAvailable}</Label>
                      <Input
                        id="add-inv"
                        type="number"
                        min="0"
                        step="1"
                        value={addForm.inventory}
                        onChange={(event) => setAddForm((current) => ({ ...current, inventory: event.target.value }))}
                        placeholder="0"
                        aria-invalid={Boolean(addFormErrors.inventory)}
                      />
                      {addFormErrors.inventory ? <p className="text-xs text-destructive">{addFormErrors.inventory}</p> : null}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-disc">{t.admin.discountShort}</Label>
                    <Input
                      id="add-disc"
                      type="number"
                      min="0"
                      max="100"
                      step="1"
                      value={addForm.discountPercent}
                      onChange={(event) => setAddForm((current) => ({ ...current, discountPercent: event.target.value }))}
                      placeholder="0"
                      aria-invalid={Boolean(addFormErrors.discountPercent)}
                    />
                    {addFormErrors.discountPercent ? (
                      <p className="text-xs text-destructive">{addFormErrors.discountPercent}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-cat">{t.admin.category}</Label>
                    <p className="text-xs text-muted-foreground">
                      {t.admin.categorySuggestionHelp}
                    </p>
                    <Input
                      id="add-cat"
                      list="admin-product-category-suggestions"
                      value={addForm.category}
                      onChange={(event) => setAddForm((current) => ({ ...current, category: event.target.value }))}
                      placeholder={t.admin.categoryPlaceholderNew}
                      aria-invalid={Boolean(addFormErrors.category)}
                      autoComplete="off"
                    />
                    <datalist id="admin-product-category-suggestions">
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                    {addFormErrors.category ? <p className="text-xs text-destructive">{addFormErrors.category}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label>{t.admin.imagesUpTo.replace("{count}", String(MAX_PRODUCT_PHOTOS))}</Label>
                    <PhotoSlots
                      photos={addForm.photos}
                      t={t}
                      labelPrefix="add-product"
                      onUpload={uploadAddFormPhoto}
                      onRemove={removeAddFormPhoto}
                    />
                    {addFormErrors.photos ? <p className="text-xs text-destructive">{addFormErrors.photos}</p> : null}
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" className="bg-transparent" onClick={() => setAddProductOpen(false)}>
                    {t.admin.cancel}
                  </Button>
                  <Button type="button" onClick={handleSubmitNewProduct} disabled={isAddingProduct}>
                    {isAddingProduct ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        {t.admin.saving}
                      </>
                    ) : (
                      t.admin.saveChanges
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog
              open={deleteTargetId !== null}
              onOpenChange={(open) => {
                if (!open) closeDeleteProduct()
              }}
            >
              <DialogContent showClose={false} className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t.admin.deleteProduct}</DialogTitle>
                  <DialogDescription>{t.admin.deleteProductDescription}</DialogDescription>
                </DialogHeader>
                {deleteTargetProduct ? (
                  <p className="text-sm text-muted-foreground">
                    {t.admin.productLabel} <span className="font-medium text-foreground">{deleteTargetProduct.name}</span>
                  </p>
                ) : null}
                <div className="space-y-2 py-2">
                  <Label htmlFor="delete-confirm">{t.admin.confirmation}</Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmText}
                    onChange={(event) => setDeleteConfirmText(event.target.value)}
                    placeholder={t.admin.typeDelete}
                    autoComplete="off"
                  />
                </div>
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" className="bg-transparent" onClick={closeDeleteProduct}>
                    {t.admin.cancel}
                  </Button>
                  <Button type="button" variant="destructive" disabled={deleteConfirmText !== "DELETE"} onClick={confirmDeleteProduct}>
                    {t.admin.permanentlyDelete}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <Button
                size="lg"
                className="w-full font-medium uppercase tracking-wider sm:w-auto"
                onClick={() => {
                  setAddCollectionFormErrors({})
                  setAddCollectionFeedback("")
                  setAddCollectionForm({
                    name: "",
                    category: collectionCategoryOptions[0] || "",
                    description: "",
                    pieces: "0",
                    photos: [],
                  })
                  setAddCollectionOpen(true)
                }}
              >
                {t.admin.addCollection}
              </Button>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex flex-col gap-1 sm:min-w-[220px]">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">{t.admin.filterByCollectionCategory}</Label>
                  <select
                    className={SELECT_CLASS}
                    value={adminCollectionCategoryFilter}
                    onChange={(event) => setAdminCollectionCategoryFilter(event.target.value)}
                  >
                    <option value="all">{t.admin.allCollectionCategories}</option>
                    {collectionCategoryOptions.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" onClick={handleResetCollections} className="bg-transparent">
                  {t.admin.resetCollections}
                </Button>
              </div>
            </div>

            <section className="mt-8 rounded-lg border border-border bg-card p-5">
              <div className="rounded-md border border-border bg-background/50 p-4">
                <p className="mb-4 text-xs font-medium uppercase tracking-wider text-accent">{t.admin.featuredCollectionEssentials}</p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t.admin.featuredCollectionImage}
                    </label>
                    <PhotoSlots
                      photos={featuredCollectionDraft.photos || [featuredCollectionDraft.image]}
                      t={t}
                      labelPrefix="featured-collection"
                      onUpload={uploadFeaturedCollectionPhoto}
                      onRemove={removeFeaturedCollectionPhoto}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      value={featuredCollectionDraft.name}
                      onChange={(event) => updateFeaturedCollectionDraft("name", event.target.value)}
                      placeholder={t.admin.collectionTitle}
                    />
                    <Input
                      value={featuredCollectionDraft.tagline}
                      onChange={(event) => updateFeaturedCollectionDraft("tagline", event.target.value)}
                      placeholder={t.admin.tagline}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t.admin.collectionCategory}
                    </Label>
                    <Input
                      list="admin-featured-collection-category-suggestions"
                      value={featuredCollectionDraft.category ?? ""}
                      onChange={(event) => updateFeaturedCollectionDraft("category", event.target.value)}
                      placeholder={t.admin.collectionCategoryPlaceholder}
                      autoComplete="off"
                    />
                    <datalist id="admin-featured-collection-category-suggestions">
                      {collectionCategoryOptions.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                  </div>
                  <Textarea
                    value={featuredCollectionDraft.description}
                    onChange={(event) => updateFeaturedCollectionDraft("description", event.target.value)}
                    placeholder={t.admin.featuredCollectionDescription}
                    rows={4}
                  />
                  <div className="space-y-2">
                    <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {t.admin.featuredCollectionLink}
                    </label>
                    <Input value={`/collections/${featuredCollectionDraft.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") || "featured-collection"}`} disabled readOnly />
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSaveFeaturedCollection} disabled={isSavingFeaturedCollection}>
                      {isSavingFeaturedCollection ? (
                        <>
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                          {t.admin.saving}
                        </>
                      ) : (
                        t.admin.saveFeaturedCollection
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-8 space-y-6">
              {filteredCollectionDrafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.admin.noCollectionsMatch}</p>
              ) : null}
              {filteredCollectionDrafts.map((collection) => (
                <article key={collection.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="space-y-4">
                    <div className="rounded-md border border-border bg-background/50 p-4">
                      <p className="mb-4 text-xs font-medium uppercase tracking-wider text-accent">{t.admin.collectionEssentials}</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t.admin.collectionImage}
                          </label>
                          <PhotoSlots
                            photos={collection.photos || [collection.image]}
                            t={t}
                            labelPrefix={`collection-${collection.id}`}
                            onUpload={(index, file, event) => uploadCollectionPhoto(collection.id, index, file, event)}
                            onRemove={(index) => removeCollectionPhoto(collection.id, index)}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <Input
                            value={collection.name}
                            onChange={(event) => updateCollectionDraft(collection.id, "name", event.target.value)}
                            placeholder={t.admin.collectionTitle}
                          />
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            value={collection.pieces}
                            onChange={(event) => updateCollectionDraft(collection.id, "pieces", event.target.value)}
                            placeholder={t.admin.pieces}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            {t.admin.collectionCategory}
                          </Label>
                          <Input
                            list={`admin-collection-category-suggestions-${collection.id}`}
                            value={collection.category ?? ""}
                            onChange={(event) => updateCollectionDraft(collection.id, "category", event.target.value)}
                            placeholder={t.admin.collectionCategoryPlaceholder}
                            autoComplete="off"
                          />
                          <datalist id={`admin-collection-category-suggestions-${collection.id}`}>
                            {collectionCategoryOptions.map((category) => (
                              <option key={category} value={category} />
                            ))}
                          </datalist>
                        </div>
                      </div>
                    </div>
                    <Textarea
                      value={collection.description}
                      onChange={(event) => updateCollectionDraft(collection.id, "description", event.target.value)}
                      placeholder={t.admin.collectionDescription}
                      rows={4}
                    />
                    <div className="space-y-2">
                      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        {t.admin.collectionLink}
                      </label>
                      <Input
                        value={`/collections/${collection.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") || "untitled-collection"}`}
                        disabled
                        readOnly
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button onClick={() => handleSaveCollection(collection.id)} disabled={savingCollectionId === collection.id}>
                        {savingCollectionId === collection.id ? (
                          <>
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            {t.admin.saving}
                          </>
                        ) : (
                          t.admin.saveCollection
                        )}
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <Dialog
              open={addCollectionOpen}
              onOpenChange={(open) => {
                setAddCollectionOpen(open)
                if (!open) {
                  setAddCollectionFormErrors({})
                  setAddCollectionFeedback("")
                }
              }}
            >
              <DialogContent className="max-h-[min(90vh,720px)] max-w-lg overflow-y-auto sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>{t.admin.addCollection}</DialogTitle>
                  <DialogDescription>
                    {t.admin.addCollectionDescription.replace("{count}", String(MAX_PRODUCT_PHOTOS))}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  {addCollectionFeedback ? <p className="text-sm text-destructive">{addCollectionFeedback}</p> : null}
                  <div className="space-y-2">
                    <Label htmlFor="add-collection-name">{t.admin.name}</Label>
                    <Input
                      id="add-collection-name"
                      value={addCollectionForm.name}
                      onChange={(event) => setAddCollectionForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder={t.admin.collectionNamePlaceholder}
                      aria-invalid={Boolean(addCollectionFormErrors.name)}
                    />
                    {addCollectionFormErrors.name ? <p className="text-xs text-destructive">{addCollectionFormErrors.name}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-collection-pieces">{t.admin.pieces}</Label>
                    <Input
                      id="add-collection-pieces"
                      type="number"
                      min="0"
                      step="1"
                      value={addCollectionForm.pieces}
                      onChange={(event) => setAddCollectionForm((current) => ({ ...current, pieces: event.target.value }))}
                      placeholder="0"
                      aria-invalid={Boolean(addCollectionFormErrors.pieces)}
                    />
                    {addCollectionFormErrors.pieces ? <p className="text-xs text-destructive">{addCollectionFormErrors.pieces}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-collection-category">{t.admin.collectionCategory}</Label>
                    <Input
                      id="add-collection-category"
                      list="admin-add-collection-category-suggestions"
                      value={addCollectionForm.category}
                      onChange={(event) => setAddCollectionForm((current) => ({ ...current, category: event.target.value }))}
                      placeholder={t.admin.collectionCategoryPlaceholder}
                      aria-invalid={Boolean(addCollectionFormErrors.category)}
                      autoComplete="off"
                    />
                    <datalist id="admin-add-collection-category-suggestions">
                      {collectionCategoryOptions.map((category) => (
                        <option key={category} value={category} />
                      ))}
                    </datalist>
                    {addCollectionFormErrors.category ? <p className="text-xs text-destructive">{addCollectionFormErrors.category}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-collection-description">{t.admin.description}</Label>
                    <Textarea
                      id="add-collection-description"
                      value={addCollectionForm.description}
                      onChange={(event) => setAddCollectionForm((current) => ({ ...current, description: event.target.value }))}
                      placeholder={t.admin.collectionDescriptionPlaceholder}
                      rows={4}
                      aria-invalid={Boolean(addCollectionFormErrors.description)}
                    />
                    {addCollectionFormErrors.description ? (
                      <p className="text-xs text-destructive">{addCollectionFormErrors.description}</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <Label>{t.admin.imagesUpTo.replace("{count}", String(MAX_PRODUCT_PHOTOS))}</Label>
                    <PhotoSlots
                      photos={addCollectionForm.photos}
                      t={t}
                      labelPrefix="add-collection"
                      onUpload={uploadAddCollectionPhoto}
                      onRemove={removeAddCollectionPhoto}
                    />
                    {addCollectionFormErrors.photos ? <p className="text-xs text-destructive">{addCollectionFormErrors.photos}</p> : null}
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" className="bg-transparent" onClick={() => setAddCollectionOpen(false)}>
                    {t.admin.cancel}
                  </Button>
                  <Button type="button" onClick={handleSubmitNewCollection} disabled={isAddingCollection}>
                    {isAddingCollection ? (
                      <>
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        {t.admin.saving}
                      </>
                    ) : (
                      t.admin.saveCollection
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
