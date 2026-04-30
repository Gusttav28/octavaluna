export const PRODUCT_STORAGE_KEY = "octavaluna_products"

export const defaultProducts = [
  {
    id: 1,
    name: "Luna Crescent Necklace",
    price: 385,
    category: "Necklaces",
    image: "/crescent-moon-gold-necklace-luxury-jewelry.jpg",
    photos: ["/crescent-moon-gold-necklace-luxury-jewelry.jpg"],
    description: "A delicate crescent pendant in polished gold, designed for elegant everyday wear.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/luna-crescent-necklace",
  },
  {
    id: 2,
    name: "Celestial Band Ring",
    price: 225,
    category: "Rings",
    image: "/gold-band-ring-with-small-diamonds-luxury.jpg",
    photos: ["/gold-band-ring-with-small-diamonds-luxury.jpg"],
    description: "A timeless gold band with subtle stone accents that catch the light.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/celestial-band-ring",
  },
  {
    id: 3,
    name: "Aurora Drop Earrings",
    price: 295,
    category: "Earrings",
    image: "/gold-drop-earrings-elegant-luxury.jpg",
    photos: ["/gold-drop-earrings-elegant-luxury.jpg"],
    description: "Graceful drop earrings with a refined silhouette for statement evenings.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/aurora-drop-earrings",
  },
  {
    id: 4,
    name: "Solstice Pearl Pendant",
    price: 445,
    category: "Necklaces",
    image: "/pearl-pendant-gold-necklace-luxury-elegant.jpg",
    photos: ["/pearl-pendant-gold-necklace-luxury-elegant.jpg"],
    description: "A luminous pearl centerpiece suspended from a soft gold chain.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/solstice-pearl-pendant",
  },
  {
    id: 5,
    name: "Starlight Hoops",
    price: 265,
    category: "Earrings",
    image: "/gold-hoop-earrings-classic-luxury.jpg",
    photos: ["/gold-hoop-earrings-classic-luxury.jpg"],
    description: "Classic hoop earrings elevated with a modern polished finish.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/starlight-hoops",
  },
  {
    id: 6,
    name: "Eclipse Signet Ring",
    price: 320,
    category: "Rings",
    image: "/gold-signet-ring-minimalist-luxury.jpg",
    photos: ["/gold-signet-ring-minimalist-luxury.jpg"],
    description: "A bold signet profile with clean lines and balanced proportions.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/eclipse-signet-ring",
  },
  {
    id: 7,
    name: "Moonstone Pendant",
    price: 425,
    category: "Necklaces",
    image: "/gold-necklace-pendant-luxury-jewelry-on-cream-back.jpg",
    photos: ["/gold-necklace-pendant-luxury-jewelry-on-cream-back.jpg"],
    description: "An iridescent moonstone pendant crafted to highlight natural glow.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/moonstone-pendant",
  },
  {
    id: 8,
    name: "Diamond Eternity Ring",
    price: 595,
    category: "Rings",
    image: "/gold-diamond-ring-luxury-jewelry-on-cream-backgrou.jpg",
    photos: ["/gold-diamond-ring-luxury-jewelry-on-cream-backgrou.jpg"],
    description: "A luxurious eternity ring set with shimmering stones across the band.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/diamond-eternity-ring",
  },
  {
    id: 9,
    name: "Cascade Drop Earrings",
    price: 345,
    category: "Earrings",
    image: "/gold-earrings-drop-luxury-jewelry-on-cream-backgro.jpg",
    photos: ["/gold-earrings-drop-luxury-jewelry-on-cream-backgro.jpg"],
    description: "Layered drops create movement and sparkle for sophisticated styling.",
    discountPercent: 0,
    inventory: 20,
    unitsSoldTotal: 0,
    href: "/product/cascade-drop-earrings",
  },
]

export function normalizeProduct(product) {
  const photos =
    Array.isArray(product.photos) && product.photos.length > 0
      ? product.photos.filter((photo) => typeof photo === "string" && photo.trim().length > 0)
      : [product.image].filter(Boolean)

  const primaryPhoto = photos[0] || "/placeholder.svg"

  const categoryRaw = typeof product.category === "string" ? product.category.trim() : ""

  return {
    ...product,
    image: primaryPhoto,
    photos,
    description: typeof product.description === "string" ? product.description : "",
    category: categoryRaw || "Uncategorized",
    discountPercent: Math.max(0, Math.min(100, Number(product.discountPercent) || 0)),
    inventory: Math.max(0, Math.floor(Number(product.inventory) || 0)),
    unitsSoldTotal: Math.max(0, Math.floor(Number(product.unitsSoldTotal) || 0)),
  }
}

export function getDiscountedPrice(price, discountPercent) {
  const discount = Math.max(0, Math.min(100, Number(discountPercent) || 0))
  const safePrice = Number(price) || 0
  return safePrice * (1 - discount / 100)
}

export function parseStoredProducts(value) {
  if (!value) return null

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return null
    return parsed.map(normalizeProduct)
  } catch {
    return null
  }
}

