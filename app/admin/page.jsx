"use client"

import { useEffect, useMemo, useState } from "react"
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

function toPhotoArray(value) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
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

const SELECT_CLASS =
  "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

export default function AdminPage() {
  const { products, saveProducts, resetProducts, recordProductSale } = useProducts()
  const { categories, ensureCategoriesExist } = useProductCategories()
  const { collections, featuredCollection, saveCollections, saveFeaturedCollection, resetCollections } = useCollections()
  const [drafts, setDrafts] = useState(products)
  const [collectionDrafts, setCollectionDrafts] = useState(collections)
  const [featuredCollectionDraft, setFeaturedCollectionDraft] = useState(featuredCollection)
  const [recordingSaleForId, setRecordingSaleForId] = useState(null)
  const [pendingSaleQtyById, setPendingSaleQtyById] = useState({})
  const [message, setMessage] = useState("")
  const [activeSection, setActiveSection] = useState("shop")
  const [adminCategoryFilter, setAdminCategoryFilter] = useState("all")
  const [addProductOpen, setAddProductOpen] = useState(false)
  const [addForm, setAddForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    photos: "",
    discountPercent: "0",
    inventory: "0",
  })
  const [addFormErrors, setAddFormErrors] = useState({})
  const [addFeedback, setAddFeedback] = useState("")
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [deleteConfirmText, setDeleteConfirmText] = useState("")

  useEffect(() => {
    setDrafts(products)
  }, [products])

  useEffect(() => {
    setCollectionDrafts(collections)
  }, [collections])

  useEffect(() => {
    setFeaturedCollectionDraft(featuredCollection)
  }, [featuredCollection])

  const productCountLabel = useMemo(() => `${drafts.length} products`, [drafts.length])
  const collectionCountLabel = useMemo(() => `${collectionDrafts.length} collections`, [collectionDrafts.length])

  const categoryOptions = useMemo(
    () => mergeUniqueCategoryNames([categories, drafts.map((p) => p.category).filter(Boolean)]),
    [categories, drafts],
  )

  const filteredDrafts = useMemo(() => {
    if (adminCategoryFilter === "all") return drafts
    return drafts.filter(
      (p) => String(p.category || "").toLowerCase() === String(adminCategoryFilter).toLowerCase(),
    )
  }, [drafts, adminCategoryFilter])

  const deleteTargetProduct = useMemo(
    () => drafts.find((p) => p.id === deleteTargetId) || null,
    [drafts, deleteTargetId],
  )

  useEffect(() => {
    if (adminCategoryFilter === "all") return
    const exists = categoryOptions.some((c) => c.toLowerCase() === adminCategoryFilter.toLowerCase())
    if (!exists) setAdminCategoryFilter("all")
  }, [adminCategoryFilter, categoryOptions])

  const updateDraft = (id, key, value) => {
    setDrafts((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const updateCollectionDraft = (id, key, value) => {
    setCollectionDrafts((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)))
  }

  const updateFeaturedCollectionDraft = (key, value) => {
    setFeaturedCollectionDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSaveProduct = (id) => {
    const nextProducts = drafts.map((item) => {
      if (item.id !== id) return item

      const normalizedPhotos =
        Array.isArray(item.photos) && item.photos.length > 0 ? item.photos.filter(Boolean) : [item.image].filter(Boolean)

      return {
        ...item,
        name: item.name.trim() || "Untitled Product",
        price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
        discountPercent: Math.max(0, Math.min(100, Number(item.discountPercent) || 0)),
        inventory: Math.max(0, Math.floor(Number(item.inventory) || 0)),
        unitsSoldTotal: Math.max(0, Math.floor(Number(item.unitsSoldTotal) || 0)),
        photos: normalizedPhotos,
        image: normalizedPhotos[0] || "/placeholder.svg",
        href: toProductHref(item.name),
        category: normalizeCategoryName(item.category) || "Uncategorized",
      }
    })

    saveProducts(nextProducts)
    const saved = nextProducts.find((p) => p.id === id)
    if (saved?.category) ensureCategoriesExist([saved.category])
    setMessage("Product saved.")
  }

  const handleSubmitNewProduct = () => {
    setAddFormErrors({})
    setAddFeedback("")
    const errors = {}
    const name = addForm.name.trim()
    const description = addForm.description.trim()
    const price = Number(addForm.price)
    const category = normalizeCategoryName(addForm.category)
    const photos = toPhotoArray(addForm.photos)
    const discountPercent = Number(addForm.discountPercent)
    const inventory = Math.floor(Number(addForm.inventory))

    if (!name) errors.name = "Name is required."
    if (!description) errors.description = "Description is required."
    if (!Number.isFinite(price) || price < 0) errors.price = "Enter a valid price (0 or greater)."
    if (!category) errors.category = "Enter a category (pick a suggestion or type a new name)."
    if (photos.length === 0) errors.photos = "Add at least one image URL or path."
    if (!Number.isFinite(discountPercent) || discountPercent < 0 || discountPercent > 100) {
      errors.discountPercent = "Discount must be between 0 and 100."
    }
    if (!Number.isFinite(inventory) || inventory < 0) errors.inventory = "Units available must be 0 or greater."

    if (Object.keys(errors).length > 0) {
      setAddFormErrors(errors)
      setAddFeedback("Please fix the highlighted fields.")
      return
    }

    const nextId = Math.max(0, ...drafts.map((p) => Number(p.id) || 0)) + 1
    const normalized = normalizeProduct({
      id: nextId,
      name,
      description,
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
    setAddProductOpen(false)
    setAddForm({
      name: "",
      description: "",
      price: "",
      category: "",
      photos: "",
      discountPercent: "0",
      inventory: "0",
    })
    setMessage(`Product "${name}" added.`)
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
    setMessage("Product permanently removed.")
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
      setMessage("This product is out of stock.")
      return
    }

    if (quantityToSell > currentInventory) {
      setMessage(`Not enough inventory. Available units: ${currentInventory}.`)
      return
    }

    recordProductSale(id, quantityToSell)
    setRecordingSaleForId(null)
    setMessage(`Off-site sale recorded (${quantityToSell} units). Stock and sold total updated.`)
  }

  const handleSaveCollection = (id) => {
    const nextCollections = collectionDrafts.map((collection) => {
      if (collection.id !== id) return collection

      const safeName = collection.name?.trim() || "Untitled Collection"

      return {
        ...collection,
        name: safeName,
        pieces: Math.max(0, Number(collection.pieces) || 0),
        href: `/collections/${safeName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}`,
      }
    })

    saveCollections(nextCollections)
    setMessage("Collection saved.")
  }

  const handleSaveFeaturedCollection = () => {
    const safeName = featuredCollectionDraft.name?.trim() || "Featured Collection"
    const safeTagline = featuredCollectionDraft.tagline?.trim() || "Featured"
    const safeDescription = featuredCollectionDraft.description?.trim() || ""
    const safeImage = featuredCollectionDraft.image?.trim() || "/placeholder.svg"

    const nextFeaturedCollection = {
      ...featuredCollectionDraft,
      name: safeName,
      tagline: safeTagline,
      description: safeDescription,
      image: safeImage,
      href: `/collections/${safeName.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-")}`,
    }

    saveFeaturedCollection(nextFeaturedCollection)
    setMessage("Featured collection saved.")
  }

  const handleResetProducts = () => {
    resetProducts()
    setMessage("Products reset to defaults.")
  }

  const handleResetCollections = () => {
    resetCollections()
    setMessage("Collections reset to defaults.")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-4xl text-foreground">Admin Panel</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage shop products and collections in one place.
            </p>
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
              Shop Products
            </Button>
            <Button
              variant={activeSection === "collections" ? "default" : "outline"}
              onClick={() => setActiveSection("collections")}
              className={activeSection === "collections" ? "" : "bg-transparent"}
            >
              Collections
            </Button>
          </div>
        </div>

        {message ? <p className="mt-4 text-sm text-accent">{message}</p> : null}

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
                    description: "",
                    price: "",
                    category: categoryOptions[0] || "",
                    photos: "",
                    discountPercent: "0",
                    inventory: "0",
                  })
                  setAddProductOpen(true)
                }}
              >
                Add product
              </Button>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex flex-col gap-1 sm:min-w-[220px]">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Filter by category</Label>
                  <select
                    className={SELECT_CLASS}
                    value={adminCategoryFilter}
                    onChange={(event) => setAdminCategoryFilter(event.target.value)}
                  >
                    <option value="all">All categories</option>
                    {categoryOptions.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" onClick={handleResetProducts} className="bg-transparent shrink-0">
                  Reset products to defaults
                </Button>
              </div>
            </div>

            <section className="mt-8 space-y-6">
              {filteredDrafts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No products match this category.</p>
              ) : null}
              {filteredDrafts.map((product) => (
                <article key={product.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="mb-4 flex flex-wrap items-start justify-end gap-2">
                    <Button type="button" variant="destructive" size="sm" onClick={() => openDeleteProduct(product.id)}>
                      Delete product
                    </Button>
                  </div>
                  <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
                    <div className="space-y-3">
                      <img
                        src={product.photos?.[0] || product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="aspect-[4/5] w-full rounded-md object-cover"
                      />
                      <div>
                        <p className="font-serif text-lg text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">${Number(product.price).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</label>
                          <Input
                            value={product.name}
                            onChange={(event) => updateDraft(product.id, "name", event.target.value)}
                            placeholder="Product title"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</label>
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

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</label>
                        <p className="text-[11px] text-muted-foreground">
                          Select a suggestion or type a new category; it is saved when you save changes.
                        </p>
                        <Input
                          list={`admin-category-datalist-${product.id}`}
                          value={product.category ?? ""}
                          onChange={(event) => updateDraft(product.id, "category", event.target.value)}
                          placeholder="e.g. Rings or type a new category"
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
                          Discount percentage
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

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Description
                        </label>
                        <Textarea
                          value={product.description}
                          onChange={(event) => updateDraft(product.id, "description", event.target.value)}
                          placeholder="Enter product description"
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Photos (comma or new line separated URLs/paths)
                        </label>
                        <Textarea
                          value={(product.photos || [product.image]).join("\n")}
                          onChange={(event) => updateDraft(product.id, "photos", toPhotoArray(event.target.value))}
                          placeholder="/image-one.jpg, /image-two.jpg"
                          rows={5}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Product link (auto-generated from title)
                        </label>
                        <Input value={toProductHref(product.name)} disabled readOnly />
                      </div>

                      <div className="space-y-4 border-t border-border pt-4">
                        <p className="text-xs text-muted-foreground">
                          Use <span className="font-medium text-foreground">Record sale</span> when items were sold
                          outside the website; then enter how many units were sold in that transaction.
                        </p>

                        {recordingSaleForId === product.id ? (
                          <div className="rounded-md border border-border bg-secondary/40 p-4 space-y-3">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Units in this sale (off-site)
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
                                Confirm sale
                              </Button>
                              <Button type="button" variant="outline" onClick={cancelRecordingSale} className="bg-transparent">
                                Cancel
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
                            Record off-site sale
                          </Button>
                        )}

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Units sold (total recorded)
                            </label>
                            <Input
                              type="number"
                              value={product.unitsSoldTotal ?? 0}
                              disabled
                              readOnly
                              className="bg-muted/50"
                            />
                            <p className="text-[11px] text-muted-foreground">
                              Updates when you confirm an off-site sale; not editable directly.
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                              Units available
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
                          <Button onClick={() => handleSaveProduct(product.id)}>Save changes</Button>
                        </div>
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
                  <DialogTitle>Add product</DialogTitle>
                  <DialogDescription>
                    Fill in the details below. The product link is generated from the name when you save.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  {addFeedback ? <p className="text-sm text-destructive">{addFeedback}</p> : null}
                  <div className="space-y-2">
                    <Label htmlFor="add-name">Name</Label>
                    <Input
                      id="add-name"
                      value={addForm.name}
                      onChange={(event) => setAddForm((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Product name"
                      aria-invalid={Boolean(addFormErrors.name)}
                    />
                    {addFormErrors.name ? <p className="text-xs text-destructive">{addFormErrors.name}</p> : null}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="add-desc">Description</Label>
                    <Textarea
                      id="add-desc"
                      value={addForm.description}
                      onChange={(event) => setAddForm((current) => ({ ...current, description: event.target.value }))}
                      placeholder="Short description"
                      rows={4}
                      aria-invalid={Boolean(addFormErrors.description)}
                    />
                    {addFormErrors.description ? <p className="text-xs text-destructive">{addFormErrors.description}</p> : null}
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="add-price">Price</Label>
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
                      <Label htmlFor="add-inv">Units available</Label>
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
                    <Label htmlFor="add-disc">Discount %</Label>
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
                    <Label htmlFor="add-cat">Category</Label>
                    <p className="text-xs text-muted-foreground">
                      Pick from suggestions or type any name — new categories are created automatically when you save.
                    </p>
                    <Input
                      id="add-cat"
                      list="admin-product-category-suggestions"
                      value={addForm.category}
                      onChange={(event) => setAddForm((current) => ({ ...current, category: event.target.value }))}
                      placeholder="e.g. Bracelets, Rings, or a new name"
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
                    <Label htmlFor="add-photos">Images (URLs or paths, comma or new line)</Label>
                    <Textarea
                      id="add-photos"
                      value={addForm.photos}
                      onChange={(event) => setAddForm((current) => ({ ...current, photos: event.target.value }))}
                      placeholder="/image-one.jpg"
                      rows={4}
                      aria-invalid={Boolean(addFormErrors.photos)}
                    />
                    {addFormErrors.photos ? <p className="text-xs text-destructive">{addFormErrors.photos}</p> : null}
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button type="button" variant="outline" className="bg-transparent" onClick={() => setAddProductOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleSubmitNewProduct}>
                    Save changes
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
                  <DialogTitle>Delete product</DialogTitle>
                  <DialogDescription>
                    This cannot be undone. To confirm, type the word <span className="font-mono font-semibold text-foreground">DELETE</span>{" "}
                    exactly as shown (all caps).
                  </DialogDescription>
                </DialogHeader>
                {deleteTargetProduct ? (
                  <p className="text-sm text-muted-foreground">
                    Product: <span className="font-medium text-foreground">{deleteTargetProduct.name}</span>
                  </p>
                ) : null}
                <div className="space-y-2 py-2">
                  <Label htmlFor="delete-confirm">Confirmation</Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmText}
                    onChange={(event) => setDeleteConfirmText(event.target.value)}
                    placeholder="Type DELETE"
                    autoComplete="off"
                  />
                </div>
                <DialogFooter className="gap-2">
                  <Button type="button" variant="outline" className="bg-transparent" onClick={closeDeleteProduct}>
                    Cancel
                  </Button>
                  <Button type="button" variant="destructive" disabled={deleteConfirmText !== "DELETE"} onClick={confirmDeleteProduct}>
                    Permanently delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            <div className="mt-6 flex gap-2">
              <Button variant="outline" onClick={handleResetCollections} className="bg-transparent">
                Reset collections to defaults
              </Button>
              <Button onClick={handleSaveFeaturedCollection}>Save featured collection</Button>
            </div>

            <section className="mt-8 rounded-lg border border-border bg-card p-5">
              <h2 className="font-serif text-2xl text-foreground">Featured collection</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Input
                  value={featuredCollectionDraft.name}
                  onChange={(event) => updateFeaturedCollectionDraft("name", event.target.value)}
                  placeholder="Collection title"
                />
                <Input
                  value={featuredCollectionDraft.tagline}
                  onChange={(event) => updateFeaturedCollectionDraft("tagline", event.target.value)}
                  placeholder="Tagline"
                />
                <Input
                  value={featuredCollectionDraft.image}
                  onChange={(event) => updateFeaturedCollectionDraft("image", event.target.value)}
                  placeholder="/featured-image.jpg"
                  className="sm:col-span-2"
                />
                <Textarea
                  value={featuredCollectionDraft.description}
                  onChange={(event) => updateFeaturedCollectionDraft("description", event.target.value)}
                  placeholder="Featured collection description"
                  rows={4}
                  className="sm:col-span-2"
                />
              </div>
              <div className="mt-3 space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Featured collection link (auto-generated from title)
                </label>
                <Input value={`/collections/${featuredCollectionDraft.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") || "featured-collection"}`} disabled readOnly />
              </div>
            </section>

            <section className="mt-8 space-y-6">
              {collectionDrafts.map((collection) => (
                <article key={collection.id} className="rounded-lg border border-border bg-card p-5">
                  <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
                    <img
                      src={collection.image || "/placeholder.svg"}
                      alt={collection.name}
                      className="aspect-square w-full rounded-md object-cover"
                    />
                    <div className="space-y-4">
                      <Input
                        value={collection.name}
                        onChange={(event) => updateCollectionDraft(collection.id, "name", event.target.value)}
                        placeholder="Collection title"
                      />
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        value={collection.pieces}
                        onChange={(event) => updateCollectionDraft(collection.id, "pieces", event.target.value)}
                        placeholder="Pieces"
                      />
                      <Input
                        value={collection.image}
                        onChange={(event) => updateCollectionDraft(collection.id, "image", event.target.value)}
                        placeholder="/collection-image.jpg"
                      />
                      <Textarea
                        value={collection.description}
                        onChange={(event) => updateCollectionDraft(collection.id, "description", event.target.value)}
                        placeholder="Collection description"
                        rows={4}
                      />
                      <div className="space-y-2">
                        <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          Collection link (auto-generated from title)
                        </label>
                        <Input
                          value={`/collections/${collection.name?.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-") || "untitled-collection"}`}
                          disabled
                          readOnly
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={() => handleSaveCollection(collection.id)}>Save collection</Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

